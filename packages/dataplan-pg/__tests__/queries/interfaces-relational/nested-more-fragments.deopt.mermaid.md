```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    PgClassExpression_13["PgClassExpression[_13∈1]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgPolymorphic_25["PgPolymorphic[_25∈3]"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_182["PgClassExpression[_182∈4]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_32["PgSelectSingle[_32∈4]<br />ᐸrelational_topicsᐳ"]:::plan
    First_31["First[_31∈3]"]:::plan
    PgSelect_27[["PgSelect[_27∈3]<br />ᐸrelational_topicsᐳ"]]:::plan
    PgClassExpression_339["PgClassExpression[_339∈10]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈10]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈10]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_189["PgSelectSingle[_189∈10]<br />ᐸrelational_postsᐳ"]:::plan
    First_188["First[_188∈3]"]:::plan
    PgSelect_184[["PgSelect[_184∈3]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression_498["PgClassExpression[_498∈11]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_499["PgClassExpression[_499∈11]<br />ᐸ__relation...__.”color”ᐳ"]:::plan
    PgSelectSingle_348["PgSelectSingle[_348∈11]<br />ᐸrelational_dividersᐳ"]:::plan
    First_347["First[_347∈3]"]:::plan
    PgSelect_343[["PgSelect[_343∈3]<br />ᐸrelational_dividersᐳ"]]:::plan
    PgClassExpression_656["PgClassExpression[_656∈12]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_506["PgSelectSingle[_506∈12]<br />ᐸrelational_checklistsᐳ"]:::plan
    First_505["First[_505∈3]"]:::plan
    PgSelect_501[["PgSelect[_501∈3]<br />ᐸrelational_checklistsᐳ"]]:::plan
    PgClassExpression_813["PgClassExpression[_813∈13]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_814["PgClassExpression[_814∈13]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_663["PgSelectSingle[_663∈13]<br />ᐸrelational_checklist_itemsᐳ"]:::plan
    First_662["First[_662∈3]"]:::plan
    PgSelect_658[["PgSelect[_658∈3]<br />ᐸrelational_checklist_itemsᐳ"]]:::plan
    PgClassExpression_657["PgClassExpression[_657∈3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgPolymorphic_41["PgPolymorphic[_41∈3]"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_65["PgClassExpression[_65∈5]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_48["PgSelectSingle[_48∈5]<br />ᐸrelational_topicsᐳ"]:::plan
    First_47["First[_47∈3]"]:::plan
    PgSelect_43[["PgSelect[_43∈3]<br />ᐸrelational_topicsᐳ"]]:::plan
    PgClassExpression_89["PgClassExpression[_89∈6]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_90["PgClassExpression[_90∈6]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_91["PgClassExpression[_91∈6]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_72["PgSelectSingle[_72∈6]<br />ᐸrelational_postsᐳ"]:::plan
    First_71["First[_71∈3]"]:::plan
    PgSelect_67[["PgSelect[_67∈3]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression_115["PgClassExpression[_115∈7]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_116["PgClassExpression[_116∈7]<br />ᐸ__relation...__.”color”ᐳ"]:::plan
    PgSelectSingle_98["PgSelectSingle[_98∈7]<br />ᐸrelational_dividersᐳ"]:::plan
    First_97["First[_97∈3]"]:::plan
    PgSelect_93[["PgSelect[_93∈3]<br />ᐸrelational_dividersᐳ"]]:::plan
    PgClassExpression_140["PgClassExpression[_140∈8]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_123["PgSelectSingle[_123∈8]<br />ᐸrelational_checklistsᐳ"]:::plan
    First_122["First[_122∈3]"]:::plan
    PgSelect_118[["PgSelect[_118∈3]<br />ᐸrelational_checklistsᐳ"]]:::plan
    PgClassExpression_164["PgClassExpression[_164∈9]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_165["PgClassExpression[_165∈9]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_147["PgSelectSingle[_147∈9]<br />ᐸrelational_checklist_itemsᐳ"]:::plan
    First_146["First[_146∈3]"]:::plan
    PgSelect_142[["PgSelect[_142∈3]<br />ᐸrelational_checklist_itemsᐳ"]]:::plan
    PgClassExpression_772["PgClassExpression[_772∈3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈3]<br />ᐸ__relation...__.”type2”ᐳ"]:::plan
    PgClassExpression_59["PgClassExpression[_59∈3]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgSelectSingle_58["PgSelectSingle[_58∈3]<br />ᐸpeopleᐳ"]:::plan
    First_57["First[_57∈3]"]:::plan
    PgSelect_53[["PgSelect[_53∈3]<br />ᐸpeopleᐳ"]]:::plan
    PgClassExpression_52["PgClassExpression[_52∈3]<br />ᐸ__relation...author_id”ᐳ"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈3]<br />ᐸ__relation...”position”ᐳ"]:::plan
    PgClassExpression_61["PgClassExpression[_61∈3]<br />ᐸ__relation...reated_at”ᐳ"]:::plan
    PgClassExpression_62["PgClassExpression[_62∈3]<br />ᐸ__relation...pdated_at”ᐳ"]:::plan
    PgClassExpression_63["PgClassExpression[_63∈3]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈3]<br />ᐸ__relation...chived_at”ᐳ"]:::plan
    PgSelectSingle_39["PgSelectSingle[_39∈3]<br />ᐸrelational_itemsᐳ"]:::plan
    First_38["First[_38∈3]"]:::plan
    PgSelect_34[["PgSelect[_34∈3]<br />ᐸrelational_itemsᐳ"]]:::plan
    PgClassExpression_33["PgClassExpression[_33∈3]<br />ᐸ__relation...parent_id”ᐳ"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈3]<br />ᐸ__relation...__.”type2”ᐳ"]:::plan
    PgClassExpression_176["PgClassExpression[_176∈3]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgSelectSingle_175["PgSelectSingle[_175∈3]<br />ᐸpeopleᐳ"]:::plan
    First_174["First[_174∈3]"]:::plan
    PgSelect_170[["PgSelect[_170∈3]<br />ᐸpeopleᐳ"]]:::plan
    PgClassExpression_169["PgClassExpression[_169∈3]<br />ᐸ__relation...author_id”ᐳ"]:::plan
    PgClassExpression_177["PgClassExpression[_177∈3]<br />ᐸ__relation...”position”ᐳ"]:::plan
    PgClassExpression_178["PgClassExpression[_178∈3]<br />ᐸ__relation...reated_at”ᐳ"]:::plan
    PgClassExpression_179["PgClassExpression[_179∈3]<br />ᐸ__relation...pdated_at”ᐳ"]:::plan
    PgClassExpression_180["PgClassExpression[_180∈3]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_181["PgClassExpression[_181∈3]<br />ᐸ__relation...chived_at”ᐳ"]:::plan
    PgSelectSingle_23["PgSelectSingle[_23∈3]<br />ᐸrelational_itemsᐳ"]:::plan
    __Item_22>"__Item[_22∈3]<br />ᐸ_19ᐳ"]:::itemplan
    __ListTransform_19["__ListTransform[_19∈1]<br />ᐸeach:_15ᐳ"]:::plan
    PgSelectSingle_21["PgSelectSingle[_21∈2]<br />ᐸrelational_itemsᐳ"]:::plan
    __Item_20>"__Item[_20∈2]<br />ᐸ_15ᐳ"]:::itemplan
    PgSelect_15[["PgSelect[_15∈1]<br />ᐸrelational_itemsᐳ"]]:::plan
    PgClassExpression_14["PgClassExpression[_14∈1]<br />ᐸ__people__.”person_id”ᐳ"]:::plan
    PgSelectSingle_12["PgSelectSingle[_12∈1]<br />ᐸpeopleᐳ"]:::plan
    __Item_11>"__Item[_11∈1]<br />ᐸ_7ᐳ"]:::itemplan
    PgSelect_7[["PgSelect[_7∈0]<br />ᐸpeopleᐳ"]]:::plan
    Object_804["Object[_804∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_802["Access[_802∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_803["Access[_803∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan

    %% plan dependencies
    PgSelectSingle_12 --> PgClassExpression_13
    PgSelectSingle_23 & PgClassExpression_24 --> PgPolymorphic_25
    PgSelectSingle_23 --> PgClassExpression_24
    PgSelectSingle_32 --> PgClassExpression_182
    First_31 --> PgSelectSingle_32
    PgSelect_27 --> First_31
    Object_804 & PgClassExpression_657 --> PgSelect_27
    PgSelectSingle_189 --> PgClassExpression_339
    PgSelectSingle_189 --> PgClassExpression_340
    PgSelectSingle_189 --> PgClassExpression_341
    First_188 --> PgSelectSingle_189
    PgSelect_184 --> First_188
    Object_804 & PgClassExpression_657 --> PgSelect_184
    PgSelectSingle_348 --> PgClassExpression_498
    PgSelectSingle_348 --> PgClassExpression_499
    First_347 --> PgSelectSingle_348
    PgSelect_343 --> First_347
    Object_804 & PgClassExpression_657 --> PgSelect_343
    PgSelectSingle_506 --> PgClassExpression_656
    First_505 --> PgSelectSingle_506
    PgSelect_501 --> First_505
    Object_804 & PgClassExpression_657 --> PgSelect_501
    PgSelectSingle_663 --> PgClassExpression_813
    PgSelectSingle_663 --> PgClassExpression_814
    First_662 --> PgSelectSingle_663
    PgSelect_658 --> First_662
    Object_804 & PgClassExpression_657 --> PgSelect_658
    PgSelectSingle_23 --> PgClassExpression_657
    PgSelectSingle_39 & PgClassExpression_40 --> PgPolymorphic_41
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_48 --> PgClassExpression_65
    First_47 --> PgSelectSingle_48
    PgSelect_43 --> First_47
    Object_804 & PgClassExpression_772 --> PgSelect_43
    PgSelectSingle_72 --> PgClassExpression_89
    PgSelectSingle_72 --> PgClassExpression_90
    PgSelectSingle_72 --> PgClassExpression_91
    First_71 --> PgSelectSingle_72
    PgSelect_67 --> First_71
    Object_804 & PgClassExpression_772 --> PgSelect_67
    PgSelectSingle_98 --> PgClassExpression_115
    PgSelectSingle_98 --> PgClassExpression_116
    First_97 --> PgSelectSingle_98
    PgSelect_93 --> First_97
    Object_804 & PgClassExpression_772 --> PgSelect_93
    PgSelectSingle_123 --> PgClassExpression_140
    First_122 --> PgSelectSingle_123
    PgSelect_118 --> First_122
    Object_804 & PgClassExpression_772 --> PgSelect_118
    PgSelectSingle_147 --> PgClassExpression_164
    PgSelectSingle_147 --> PgClassExpression_165
    First_146 --> PgSelectSingle_147
    PgSelect_142 --> First_146
    Object_804 & PgClassExpression_772 --> PgSelect_142
    PgSelectSingle_39 --> PgClassExpression_772
    PgSelectSingle_39 --> PgClassExpression_51
    PgSelectSingle_58 --> PgClassExpression_59
    First_57 --> PgSelectSingle_58
    PgSelect_53 --> First_57
    Object_804 & PgClassExpression_52 --> PgSelect_53
    PgSelectSingle_39 --> PgClassExpression_52
    PgSelectSingle_39 --> PgClassExpression_60
    PgSelectSingle_39 --> PgClassExpression_61
    PgSelectSingle_39 --> PgClassExpression_62
    PgSelectSingle_39 --> PgClassExpression_63
    PgSelectSingle_39 --> PgClassExpression_64
    First_38 --> PgSelectSingle_39
    PgSelect_34 --> First_38
    Object_804 & PgClassExpression_33 --> PgSelect_34
    PgSelectSingle_23 --> PgClassExpression_33
    PgSelectSingle_23 --> PgClassExpression_168
    PgSelectSingle_175 --> PgClassExpression_176
    First_174 --> PgSelectSingle_175
    PgSelect_170 --> First_174
    Object_804 & PgClassExpression_169 --> PgSelect_170
    PgSelectSingle_23 --> PgClassExpression_169
    PgSelectSingle_23 --> PgClassExpression_177
    PgSelectSingle_23 --> PgClassExpression_178
    PgSelectSingle_23 --> PgClassExpression_179
    PgSelectSingle_23 --> PgClassExpression_180
    PgSelectSingle_23 --> PgClassExpression_181
    __Item_22 --> PgSelectSingle_23
    __ListTransform_19 ==> __Item_22
    PgSelect_15 --> __ListTransform_19
    PgSelectSingle_21 -.-> __ListTransform_19
    __Item_20 --> PgSelectSingle_21
    PgSelect_15 -.-> __Item_20
    Object_804 & PgClassExpression_14 --> PgSelect_15
    PgSelectSingle_12 --> PgClassExpression_14
    __Item_11 --> PgSelectSingle_12
    PgSelect_7 ==> __Item_11
    Object_804 --> PgSelect_7
    Access_802 & Access_803 --> Object_804
    __Value_3 --> Access_802
    __Value_3 --> Access_803

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_7["ᐳpeople"]
    PgSelect_7 -.-> P_7
    P_12["ᐳpeople[]"]
    PgSelectSingle_12 -.-> P_12
    P_13["ᐳp…]ᐳusername"]
    PgClassExpression_13 -.-> P_13
    P_19["ᐳp…]ᐳitems"]
    __ListTransform_19 -.-> P_19
    P_21["ᐳp…]ᐳitems@_19[]"]
    PgSelectSingle_21 -.-> P_21
    P_24["ᐳp…]ᐳi…]ᐳtype x5"]
    PgClassExpression_24 -.-> P_24
    P_25["ᐳp…]ᐳitems[]"]
    PgPolymorphic_25 -.-> P_25
    P_40["ᐳp…]ᐳi…]ᐳp…tᐳtype x25"]
    PgClassExpression_40 -.-> P_40
    P_41["ᐳp…]ᐳi…]ᐳparent x5"]
    PgPolymorphic_41 -.-> P_41
    P_51["ᐳp…]ᐳi…]ᐳp…tᐳtype2 x25"]
    PgClassExpression_51 -.-> P_51
    P_58["ᐳp…]ᐳi…]ᐳp…tᐳauthor x25"]
    PgSelectSingle_58 -.-> P_58
    P_59["ᐳp…]ᐳi…]ᐳp…tᐳa…rᐳusername x25"]
    PgClassExpression_59 -.-> P_59
    P_60["ᐳp…]ᐳi…]ᐳp…tᐳposition x25"]
    PgClassExpression_60 -.-> P_60
    P_61["ᐳp…]ᐳi…]ᐳp…tᐳcreatedAt x25"]
    PgClassExpression_61 -.-> P_61
    P_62["ᐳp…]ᐳi…]ᐳp…tᐳupdatedAt x25"]
    PgClassExpression_62 -.-> P_62
    P_63["ᐳp…]ᐳi…]ᐳp…tᐳisExplicitlyArchived x25"]
    PgClassExpression_63 -.-> P_63
    P_64["ᐳp…]ᐳi…]ᐳp…tᐳarchivedAt x25"]
    PgClassExpression_64 -.-> P_64
    P_65["ᐳp…]ᐳi…]ᐳp…tᐳtitle x5"]
    PgClassExpression_65 -.-> P_65
    P_89["ᐳp…]ᐳi…]ᐳp…tᐳtitle x5"]
    PgClassExpression_89 -.-> P_89
    P_90["ᐳp…]ᐳi…]ᐳp…tᐳdescription x5"]
    PgClassExpression_90 -.-> P_90
    P_91["ᐳp…]ᐳi…]ᐳp…tᐳnote x5"]
    PgClassExpression_91 -.-> P_91
    P_115["ᐳp…]ᐳi…]ᐳp…tᐳtitle x5"]
    PgClassExpression_115 -.-> P_115
    P_116["ᐳp…]ᐳi…]ᐳp…tᐳcolor x5"]
    PgClassExpression_116 -.-> P_116
    P_140["ᐳp…]ᐳi…]ᐳp…tᐳtitle x5"]
    PgClassExpression_140 -.-> P_140
    P_164["ᐳp…]ᐳi…]ᐳp…tᐳdescription x5"]
    PgClassExpression_164 -.-> P_164
    P_165["ᐳp…]ᐳi…]ᐳp…tᐳnote x5"]
    PgClassExpression_165 -.-> P_165
    P_168["ᐳp…]ᐳi…]ᐳtype2 x5"]
    PgClassExpression_168 -.-> P_168
    P_175["ᐳp…]ᐳi…]ᐳauthor x5"]
    PgSelectSingle_175 -.-> P_175
    P_176["ᐳp…]ᐳi…]ᐳa…rᐳusername x5"]
    PgClassExpression_176 -.-> P_176
    P_177["ᐳp…]ᐳi…]ᐳposition x5"]
    PgClassExpression_177 -.-> P_177
    P_178["ᐳp…]ᐳi…]ᐳcreatedAt x5"]
    PgClassExpression_178 -.-> P_178
    P_179["ᐳp…]ᐳi…]ᐳupdatedAt x5"]
    PgClassExpression_179 -.-> P_179
    P_180["ᐳp…]ᐳi…]ᐳisExplicitlyArchived x5"]
    PgClassExpression_180 -.-> P_180
    P_181["ᐳp…]ᐳi…]ᐳarchivedAt x5"]
    PgClassExpression_181 -.-> P_181
    P_182["ᐳp…]ᐳi…]ᐳtitle"]
    PgClassExpression_182 -.-> P_182
    P_339["ᐳp…]ᐳi…]ᐳtitle"]
    PgClassExpression_339 -.-> P_339
    P_340["ᐳp…]ᐳi…]ᐳdescription"]
    PgClassExpression_340 -.-> P_340
    P_341["ᐳp…]ᐳi…]ᐳnote"]
    PgClassExpression_341 -.-> P_341
    P_498["ᐳp…]ᐳi…]ᐳtitle"]
    PgClassExpression_498 -.-> P_498
    P_499["ᐳp…]ᐳi…]ᐳcolor"]
    PgClassExpression_499 -.-> P_499
    P_656["ᐳp…]ᐳi…]ᐳtitle"]
    PgClassExpression_656 -.-> P_656
    P_657["ᐳp…]ᐳi…]ᐳid x5"]
    PgClassExpression_657 -.-> P_657
    P_772["ᐳp…]ᐳi…]ᐳp…tᐳid x25"]
    PgClassExpression_772 -.-> P_772
    P_813["ᐳp…]ᐳi…]ᐳdescription"]
    PgClassExpression_813 -.-> P_813
    P_814["ᐳp…]ᐳi…]ᐳnote"]
    PgClassExpression_814 -.-> P_814

    subgraph "Buckets for queries/interfaces-relational/nested-more-fragments"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀people ᐸ-A- _7"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,PgSelect_7,Access_802,Access_803,Object_804 bucket0
    Bucket1("Bucket 1 (item_11)<br />Deps: _7, _804<br />~ᐳQuery.people[]<br />⠀ROOT ᐸ-O- _12<br />⠀⠀username ᐸ-L- _13<br />⠀⠀items ᐸ-A- _19"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_11,PgSelectSingle_12,PgClassExpression_13,PgClassExpression_14,PgSelect_15,__ListTransform_19 bucket1
    Bucket2("Bucket 2 (item_20)<br />Deps: _15"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item_20,PgSelectSingle_21 bucket2
    Bucket3("Bucket 3 (item_22)<br />Deps: _19, _804<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀ROOT ᐸ-O- _25<br />⠀⠀type ᐸ-L- _24<br />⠀⠀parent ᐸ-O- _41<br />⠀⠀⠀parent.type ᐸ-L- _40<br />⠀⠀⠀parent.type2 ᐸ-L- _51<br />⠀⠀⠀parent.author ᐸ-O- _58<br />⠀⠀⠀⠀parent.author.username ᐸ-L- _59<br />⠀⠀⠀parent.position ᐸ-L- _60<br />⠀⠀⠀parent.createdAt ᐸ-L- _61<br />⠀⠀⠀parent.updatedAt ᐸ-L- _62<br />⠀⠀⠀parent.isExplicitlyArchived ᐸ-L- _63<br />⠀⠀⠀parent.archivedAt ᐸ-L- _64<br />⠀⠀⠀parent.id ᐸ-L- _772<br />⠀⠀type2 ᐸ-L- _168<br />⠀⠀author ᐸ-O- _175<br />⠀⠀⠀author.username ᐸ-L- _176<br />⠀⠀position ᐸ-L- _177<br />⠀⠀createdAt ᐸ-L- _178<br />⠀⠀updatedAt ᐸ-L- _179<br />⠀⠀isExplicitlyArchived ᐸ-L- _180<br />⠀⠀archivedAt ᐸ-L- _181<br />⠀⠀id ᐸ-L- _657"):::bucket
    classDef bucket3 stroke:#ffa500
    class Bucket3,__Item_22,PgSelectSingle_23,PgClassExpression_24,PgPolymorphic_25,PgSelect_27,First_31,PgClassExpression_33,PgSelect_34,First_38,PgSelectSingle_39,PgClassExpression_40,PgPolymorphic_41,PgSelect_43,First_47,PgClassExpression_51,PgClassExpression_52,PgSelect_53,First_57,PgSelectSingle_58,PgClassExpression_59,PgClassExpression_60,PgClassExpression_61,PgClassExpression_62,PgClassExpression_63,PgClassExpression_64,PgSelect_67,First_71,PgSelect_93,First_97,PgSelect_118,First_122,PgSelect_142,First_146,PgClassExpression_168,PgClassExpression_169,PgSelect_170,First_174,PgSelectSingle_175,PgClassExpression_176,PgClassExpression_177,PgClassExpression_178,PgClassExpression_179,PgClassExpression_180,PgClassExpression_181,PgSelect_184,First_188,PgSelect_343,First_347,PgSelect_501,First_505,PgClassExpression_657,PgSelect_658,First_662,PgClassExpression_772 bucket3
    Bucket4("Bucket 4 (polymorphic_25[RelationalTopic])<br />Deps: _31<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _182"):::bucket
    classDef bucket4 stroke:#0000ff
    class Bucket4,PgSelectSingle_32,PgClassExpression_182 bucket4
    Bucket5("Bucket 5 (polymorphic_41[RelationalTopic])<br />Deps: _47<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _65"):::bucket
    classDef bucket5 stroke:#7fff00
    class Bucket5,PgSelectSingle_48,PgClassExpression_65 bucket5
    Bucket6("Bucket 6 (polymorphic_41[RelationalPost])<br />Deps: _71<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _89<br />⠀⠀description ᐸ-L- _90<br />⠀⠀note ᐸ-L- _91"):::bucket
    classDef bucket6 stroke:#ff1493
    class Bucket6,PgSelectSingle_72,PgClassExpression_89,PgClassExpression_90,PgClassExpression_91 bucket6
    Bucket7("Bucket 7 (polymorphic_41[RelationalDivider])<br />Deps: _97<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _115<br />⠀⠀color ᐸ-L- _116"):::bucket
    classDef bucket7 stroke:#808000
    class Bucket7,PgSelectSingle_98,PgClassExpression_115,PgClassExpression_116 bucket7
    Bucket8("Bucket 8 (polymorphic_41[RelationalChecklist])<br />Deps: _122<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _140"):::bucket
    classDef bucket8 stroke:#dda0dd
    class Bucket8,PgSelectSingle_123,PgClassExpression_140 bucket8
    Bucket9("Bucket 9 (polymorphic_41[RelationalChecklistItem])<br />Deps: _146<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀description ᐸ-L- _164<br />⠀⠀note ᐸ-L- _165"):::bucket
    classDef bucket9 stroke:#ff0000
    class Bucket9,PgSelectSingle_147,PgClassExpression_164,PgClassExpression_165 bucket9
    Bucket10("Bucket 10 (polymorphic_25[RelationalPost])<br />Deps: _188<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _339<br />⠀⠀description ᐸ-L- _340<br />⠀⠀note ᐸ-L- _341"):::bucket
    classDef bucket10 stroke:#ffff00
    class Bucket10,PgSelectSingle_189,PgClassExpression_339,PgClassExpression_340,PgClassExpression_341 bucket10
    Bucket11("Bucket 11 (polymorphic_25[RelationalDivider])<br />Deps: _347<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _498<br />⠀⠀color ᐸ-L- _499"):::bucket
    classDef bucket11 stroke:#00ffff
    class Bucket11,PgSelectSingle_348,PgClassExpression_498,PgClassExpression_499 bucket11
    Bucket12("Bucket 12 (polymorphic_25[RelationalChecklist])<br />Deps: _505<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _656"):::bucket
    classDef bucket12 stroke:#4169e1
    class Bucket12,PgSelectSingle_506,PgClassExpression_656 bucket12
    Bucket13("Bucket 13 (polymorphic_25[RelationalChecklistItem])<br />Deps: _662<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀description ᐸ-L- _813<br />⠀⠀note ᐸ-L- _814"):::bucket
    classDef bucket13 stroke:#3cb371
    class Bucket13,PgSelectSingle_663,PgClassExpression_813,PgClassExpression_814 bucket13
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2 & Bucket3
    Bucket3 --> Bucket4 & Bucket5 & Bucket6 & Bucket7 & Bucket8 & Bucket9 & Bucket10 & Bucket11 & Bucket12 & Bucket13
    end
```
