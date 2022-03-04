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
    PgSelectSingle_12["PgSelectSingle[_12∈1]<br />ᐸpeopleᐳ"]:::plan
    PgPolymorphic_25["PgPolymorphic[_25∈3]"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_657["PgClassExpression[_657∈3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgClassExpression_182["PgClassExpression[_182∈4]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_32["PgSelectSingle[_32∈4]<br />ᐸrelational_topicsᐳ"]:::plan
    Map_815["Map[_815∈3]<br />ᐸ_23:{”0”:1,”1”:2}ᐳ"]:::plan
    PgPolymorphic_41["PgPolymorphic[_41∈3]"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_772["PgClassExpression[_772∈3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgClassExpression_65["PgClassExpression[_65∈5]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_48["PgSelectSingle[_48∈5]<br />ᐸrelational_topicsᐳ"]:::plan
    Map_825["Map[_825∈3]<br />ᐸ_39:{”0”:1,”1”:2}ᐳ"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈3]<br />ᐸ__relation...__.”type2”ᐳ"]:::plan
    PgClassExpression_59["PgClassExpression[_59∈3]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgSelectSingle_58["PgSelectSingle[_58∈3]<br />ᐸpeopleᐳ"]:::plan
    Map_835["Map[_835∈3]<br />ᐸ_39:{”0”:16}ᐳ"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈3]<br />ᐸ__relation...”position”ᐳ"]:::plan
    PgClassExpression_61["PgClassExpression[_61∈3]<br />ᐸ__relation...reated_at”ᐳ"]:::plan
    PgClassExpression_62["PgClassExpression[_62∈3]<br />ᐸ__relation...pdated_at”ᐳ"]:::plan
    PgClassExpression_63["PgClassExpression[_63∈3]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈3]<br />ᐸ__relation...chived_at”ᐳ"]:::plan
    PgClassExpression_89["PgClassExpression[_89∈6]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_90["PgClassExpression[_90∈6]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_91["PgClassExpression[_91∈6]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_72["PgSelectSingle[_72∈6]<br />ᐸrelational_postsᐳ"]:::plan
    Map_827["Map[_827∈3]<br />ᐸ_39:{”0”:3,”1”:4,”2”:5,”3”:6}ᐳ"]:::plan
    PgClassExpression_115["PgClassExpression[_115∈7]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_116["PgClassExpression[_116∈7]<br />ᐸ__relation...__.”color”ᐳ"]:::plan
    PgSelectSingle_98["PgSelectSingle[_98∈7]<br />ᐸrelational_dividersᐳ"]:::plan
    Map_829["Map[_829∈3]<br />ᐸ_39:{”0”:7,”1”:8,”2”:9}ᐳ"]:::plan
    PgClassExpression_140["PgClassExpression[_140∈8]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_123["PgSelectSingle[_123∈8]<br />ᐸrelational_checklistsᐳ"]:::plan
    Map_831["Map[_831∈3]<br />ᐸ_39:{”0”:10,”1”:11}ᐳ"]:::plan
    PgClassExpression_164["PgClassExpression[_164∈9]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_165["PgClassExpression[_165∈9]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_147["PgSelectSingle[_147∈9]<br />ᐸrelational_checklist_itemsᐳ"]:::plan
    Map_833["Map[_833∈3]<br />ᐸ_39:{”0”:12,”1”:13}ᐳ"]:::plan
    PgSelectSingle_39["PgSelectSingle[_39∈3]<br />ᐸrelational_itemsᐳ"]:::plan
    Map_837["Map[_837∈3]<br />ᐸ_23:{”0”:15,”1”:16,”2”:17,”3”:18,”4”:19,”5”:20,”6”:21,”7”:22,”8”:23,”9”:24,”10”:25,”11”:26,”12”:27,”13”:28,”14”:29,”15”:30,”16”:31,”17”:32,”18”:33,”19”:34,”20”:35,”21”:36}ᐳ"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈3]<br />ᐸ__relation...__.”type2”ᐳ"]:::plan
    PgClassExpression_176["PgClassExpression[_176∈3]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgSelectSingle_175["PgSelectSingle[_175∈3]<br />ᐸpeopleᐳ"]:::plan
    Map_839["Map[_839∈3]<br />ᐸ_23:{”0”:38}ᐳ"]:::plan
    PgClassExpression_177["PgClassExpression[_177∈3]<br />ᐸ__relation...”position”ᐳ"]:::plan
    PgClassExpression_178["PgClassExpression[_178∈3]<br />ᐸ__relation...reated_at”ᐳ"]:::plan
    PgClassExpression_179["PgClassExpression[_179∈3]<br />ᐸ__relation...pdated_at”ᐳ"]:::plan
    PgClassExpression_180["PgClassExpression[_180∈3]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_181["PgClassExpression[_181∈3]<br />ᐸ__relation...chived_at”ᐳ"]:::plan
    PgClassExpression_339["PgClassExpression[_339∈10]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈10]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈10]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_189["PgSelectSingle[_189∈10]<br />ᐸrelational_postsᐳ"]:::plan
    Map_817["Map[_817∈3]<br />ᐸ_23:{”0”:3,”1”:4,”2”:5,”3”:6}ᐳ"]:::plan
    PgClassExpression_498["PgClassExpression[_498∈11]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_499["PgClassExpression[_499∈11]<br />ᐸ__relation...__.”color”ᐳ"]:::plan
    PgSelectSingle_348["PgSelectSingle[_348∈11]<br />ᐸrelational_dividersᐳ"]:::plan
    Map_819["Map[_819∈3]<br />ᐸ_23:{”0”:7,”1”:8,”2”:9}ᐳ"]:::plan
    PgClassExpression_656["PgClassExpression[_656∈12]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_506["PgSelectSingle[_506∈12]<br />ᐸrelational_checklistsᐳ"]:::plan
    Map_821["Map[_821∈3]<br />ᐸ_23:{”0”:10,”1”:11}ᐳ"]:::plan
    PgClassExpression_813["PgClassExpression[_813∈13]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_814["PgClassExpression[_814∈13]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_663["PgSelectSingle[_663∈13]<br />ᐸrelational_checklist_itemsᐳ"]:::plan
    Map_823["Map[_823∈3]<br />ᐸ_23:{”0”:12,”1”:13}ᐳ"]:::plan
    PgSelectSingle_23["PgSelectSingle[_23∈3]<br />ᐸrelational_itemsᐳ"]:::plan
    __Item_22>"__Item[_22∈3]<br />ᐸ_19ᐳ"]:::itemplan
    __ListTransform_19["__ListTransform[_19∈1]<br />ᐸeach:_15ᐳ"]:::plan
    PgSelectSingle_21["PgSelectSingle[_21∈2]<br />ᐸrelational_itemsᐳ"]:::plan
    __Item_20>"__Item[_20∈2]<br />ᐸ_841ᐳ"]:::itemplan
    Access_841["Access[_841∈1]<br />ᐸ_11.1ᐳ"]:::plan
    __Item_11>"__Item[_11∈1]<br />ᐸ_7ᐳ"]:::itemplan
    PgSelect_7[["PgSelect[_7∈0]<br />ᐸpeopleᐳ"]]:::plan
    Object_804["Object[_804∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_802["Access[_802∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_803["Access[_803∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan

    %% plan dependencies
    PgSelectSingle_12 --> PgClassExpression_13
    __Item_11 --> PgSelectSingle_12
    PgSelectSingle_23 & PgClassExpression_24 --> PgPolymorphic_25
    PgSelectSingle_23 --> PgClassExpression_24
    PgSelectSingle_23 --> PgClassExpression_657
    PgSelectSingle_32 --> PgClassExpression_182
    Map_815 --> PgSelectSingle_32
    PgSelectSingle_23 --> Map_815
    PgSelectSingle_39 & PgClassExpression_40 --> PgPolymorphic_41
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_39 --> PgClassExpression_772
    PgSelectSingle_48 --> PgClassExpression_65
    Map_825 --> PgSelectSingle_48
    PgSelectSingle_39 --> Map_825
    PgSelectSingle_39 --> PgClassExpression_51
    PgSelectSingle_58 --> PgClassExpression_59
    Map_835 --> PgSelectSingle_58
    PgSelectSingle_39 --> Map_835
    PgSelectSingle_39 --> PgClassExpression_60
    PgSelectSingle_39 --> PgClassExpression_61
    PgSelectSingle_39 --> PgClassExpression_62
    PgSelectSingle_39 --> PgClassExpression_63
    PgSelectSingle_39 --> PgClassExpression_64
    PgSelectSingle_72 --> PgClassExpression_89
    PgSelectSingle_72 --> PgClassExpression_90
    PgSelectSingle_72 --> PgClassExpression_91
    Map_827 --> PgSelectSingle_72
    PgSelectSingle_39 --> Map_827
    PgSelectSingle_98 --> PgClassExpression_115
    PgSelectSingle_98 --> PgClassExpression_116
    Map_829 --> PgSelectSingle_98
    PgSelectSingle_39 --> Map_829
    PgSelectSingle_123 --> PgClassExpression_140
    Map_831 --> PgSelectSingle_123
    PgSelectSingle_39 --> Map_831
    PgSelectSingle_147 --> PgClassExpression_164
    PgSelectSingle_147 --> PgClassExpression_165
    Map_833 --> PgSelectSingle_147
    PgSelectSingle_39 --> Map_833
    Map_837 --> PgSelectSingle_39
    PgSelectSingle_23 --> Map_837
    PgSelectSingle_23 --> PgClassExpression_168
    PgSelectSingle_175 --> PgClassExpression_176
    Map_839 --> PgSelectSingle_175
    PgSelectSingle_23 --> Map_839
    PgSelectSingle_23 --> PgClassExpression_177
    PgSelectSingle_23 --> PgClassExpression_178
    PgSelectSingle_23 --> PgClassExpression_179
    PgSelectSingle_23 --> PgClassExpression_180
    PgSelectSingle_23 --> PgClassExpression_181
    PgSelectSingle_189 --> PgClassExpression_339
    PgSelectSingle_189 --> PgClassExpression_340
    PgSelectSingle_189 --> PgClassExpression_341
    Map_817 --> PgSelectSingle_189
    PgSelectSingle_23 --> Map_817
    PgSelectSingle_348 --> PgClassExpression_498
    PgSelectSingle_348 --> PgClassExpression_499
    Map_819 --> PgSelectSingle_348
    PgSelectSingle_23 --> Map_819
    PgSelectSingle_506 --> PgClassExpression_656
    Map_821 --> PgSelectSingle_506
    PgSelectSingle_23 --> Map_821
    PgSelectSingle_663 --> PgClassExpression_813
    PgSelectSingle_663 --> PgClassExpression_814
    Map_823 --> PgSelectSingle_663
    PgSelectSingle_23 --> Map_823
    __Item_22 --> PgSelectSingle_23
    __ListTransform_19 ==> __Item_22
    Access_841 --> __ListTransform_19
    PgSelectSingle_21 -.-> __ListTransform_19
    __Item_20 --> PgSelectSingle_21
    Access_841 -.-> __Item_20
    __Item_11 --> Access_841
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
    Bucket1("Bucket 1 (item_11)<br />Deps: _7<br />~ᐳQuery.people[]<br />⠀ROOT ᐸ-O- _12<br />⠀⠀username ᐸ-L- _13<br />⠀⠀items ᐸ-A- _19"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_11,PgSelectSingle_12,PgClassExpression_13,__ListTransform_19,Access_841 bucket1
    Bucket2("Bucket 2 (item_20)<br />Deps: _841"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item_20,PgSelectSingle_21 bucket2
    Bucket3("Bucket 3 (item_22)<br />Deps: _19<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀ROOT ᐸ-O- _25<br />⠀⠀type ᐸ-L- _24<br />⠀⠀parent ᐸ-O- _41<br />⠀⠀⠀parent.type ᐸ-L- _40<br />⠀⠀⠀parent.type2 ᐸ-L- _51<br />⠀⠀⠀parent.author ᐸ-O- _58<br />⠀⠀⠀⠀parent.author.username ᐸ-L- _59<br />⠀⠀⠀parent.position ᐸ-L- _60<br />⠀⠀⠀parent.createdAt ᐸ-L- _61<br />⠀⠀⠀parent.updatedAt ᐸ-L- _62<br />⠀⠀⠀parent.isExplicitlyArchived ᐸ-L- _63<br />⠀⠀⠀parent.archivedAt ᐸ-L- _64<br />⠀⠀⠀parent.id ᐸ-L- _772<br />⠀⠀type2 ᐸ-L- _168<br />⠀⠀author ᐸ-O- _175<br />⠀⠀⠀author.username ᐸ-L- _176<br />⠀⠀position ᐸ-L- _177<br />⠀⠀createdAt ᐸ-L- _178<br />⠀⠀updatedAt ᐸ-L- _179<br />⠀⠀isExplicitlyArchived ᐸ-L- _180<br />⠀⠀archivedAt ᐸ-L- _181<br />⠀⠀id ᐸ-L- _657"):::bucket
    classDef bucket3 stroke:#ffa500
    class Bucket3,__Item_22,PgSelectSingle_23,PgClassExpression_24,PgPolymorphic_25,PgSelectSingle_39,PgClassExpression_40,PgPolymorphic_41,PgClassExpression_51,PgSelectSingle_58,PgClassExpression_59,PgClassExpression_60,PgClassExpression_61,PgClassExpression_62,PgClassExpression_63,PgClassExpression_64,PgClassExpression_168,PgSelectSingle_175,PgClassExpression_176,PgClassExpression_177,PgClassExpression_178,PgClassExpression_179,PgClassExpression_180,PgClassExpression_181,PgClassExpression_657,PgClassExpression_772,Map_815,Map_817,Map_819,Map_821,Map_823,Map_825,Map_827,Map_829,Map_831,Map_833,Map_835,Map_837,Map_839 bucket3
    Bucket4("Bucket 4 (polymorphic_25[RelationalTopic])<br />Deps: _815<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _182"):::bucket
    classDef bucket4 stroke:#0000ff
    class Bucket4,PgSelectSingle_32,PgClassExpression_182 bucket4
    Bucket5("Bucket 5 (polymorphic_41[RelationalTopic])<br />Deps: _825<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _65"):::bucket
    classDef bucket5 stroke:#7fff00
    class Bucket5,PgSelectSingle_48,PgClassExpression_65 bucket5
    Bucket6("Bucket 6 (polymorphic_41[RelationalPost])<br />Deps: _827<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _89<br />⠀⠀description ᐸ-L- _90<br />⠀⠀note ᐸ-L- _91"):::bucket
    classDef bucket6 stroke:#ff1493
    class Bucket6,PgSelectSingle_72,PgClassExpression_89,PgClassExpression_90,PgClassExpression_91 bucket6
    Bucket7("Bucket 7 (polymorphic_41[RelationalDivider])<br />Deps: _829<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _115<br />⠀⠀color ᐸ-L- _116"):::bucket
    classDef bucket7 stroke:#808000
    class Bucket7,PgSelectSingle_98,PgClassExpression_115,PgClassExpression_116 bucket7
    Bucket8("Bucket 8 (polymorphic_41[RelationalChecklist])<br />Deps: _831<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀title ᐸ-L- _140"):::bucket
    classDef bucket8 stroke:#dda0dd
    class Bucket8,PgSelectSingle_123,PgClassExpression_140 bucket8
    Bucket9("Bucket 9 (polymorphic_41[RelationalChecklistItem])<br />Deps: _833<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalPost.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalTopic.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalDivider.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklist.parent<br />~ᐳQuery.people[]ᐳPerson.items[]ᐳRelationalChecklistItem.parent<br />⠀⠀description ᐸ-L- _164<br />⠀⠀note ᐸ-L- _165"):::bucket
    classDef bucket9 stroke:#ff0000
    class Bucket9,PgSelectSingle_147,PgClassExpression_164,PgClassExpression_165 bucket9
    Bucket10("Bucket 10 (polymorphic_25[RelationalPost])<br />Deps: _817<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _339<br />⠀⠀description ᐸ-L- _340<br />⠀⠀note ᐸ-L- _341"):::bucket
    classDef bucket10 stroke:#ffff00
    class Bucket10,PgSelectSingle_189,PgClassExpression_339,PgClassExpression_340,PgClassExpression_341 bucket10
    Bucket11("Bucket 11 (polymorphic_25[RelationalDivider])<br />Deps: _819<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _498<br />⠀⠀color ᐸ-L- _499"):::bucket
    classDef bucket11 stroke:#00ffff
    class Bucket11,PgSelectSingle_348,PgClassExpression_498,PgClassExpression_499 bucket11
    Bucket12("Bucket 12 (polymorphic_25[RelationalChecklist])<br />Deps: _821<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀title ᐸ-L- _656"):::bucket
    classDef bucket12 stroke:#4169e1
    class Bucket12,PgSelectSingle_506,PgClassExpression_656 bucket12
    Bucket13("Bucket 13 (polymorphic_25[RelationalChecklistItem])<br />Deps: _823<br />~ᐳQuery.people[]ᐳPerson.items[]<br />⠀⠀description ᐸ-L- _813<br />⠀⠀note ᐸ-L- _814"):::bucket
    classDef bucket13 stroke:#3cb371
    class Bucket13,PgSelectSingle_663,PgClassExpression_813,PgClassExpression_814 bucket13
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2 & Bucket3
    Bucket3 --> Bucket4 & Bucket5 & Bucket6 & Bucket7 & Bucket8 & Bucket9 & Bucket10 & Bucket11 & Bucket12 & Bucket13
    end
```
