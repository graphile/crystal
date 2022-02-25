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
    __Item_20>"__Item[_20∈2]<br /><_841>"]:::itemplan
    PgSelectSingle_21["PgSelectSingle[_21∈2]<br /><relational_items>"]:::plan
    __Item_22>"__Item[_22∈3]<br /><_19>"]:::itemplan
    PgSelectSingle_23["PgSelectSingle[_23∈3]<br /><relational_items>"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_25["PgPolymorphic[_25∈3]"]:::plan
    First_31["First[_31∈3]"]:::plan
    PgSelectSingle_32["PgSelectSingle[_32∈4]<br /><relational_topics>"]:::plan
    First_38["First[_38∈3]"]:::plan
    PgSelectSingle_39["PgSelectSingle[_39∈3]<br /><relational_items>"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_41["PgPolymorphic[_41∈3]"]:::plan
    First_47["First[_47∈3]"]:::plan
    PgSelectSingle_48["PgSelectSingle[_48∈5]<br /><relational_topics>"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈3]<br /><__relation...__.”type2”>"]:::plan
    First_57["First[_57∈3]"]:::plan
    PgSelectSingle_58["PgSelectSingle[_58∈3]<br /><people>"]:::plan
    PgClassExpression_59["PgClassExpression[_59∈3]<br /><__people__.”username”>"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈3]<br /><__relation...”position”>"]:::plan
    PgClassExpression_61["PgClassExpression[_61∈3]<br /><__relation...reated_at”>"]:::plan
    PgClassExpression_62["PgClassExpression[_62∈3]<br /><__relation...pdated_at”>"]:::plan
    PgClassExpression_63["PgClassExpression[_63∈3]<br /><__relation..._archived”>"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈3]<br /><__relation...chived_at”>"]:::plan
    PgClassExpression_65["PgClassExpression[_65∈5]<br /><__relation...__.”title”>"]:::plan
    First_71["First[_71∈3]"]:::plan
    PgSelectSingle_72["PgSelectSingle[_72∈6]<br /><relational_posts>"]:::plan
    PgClassExpression_89["PgClassExpression[_89∈6]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_90["PgClassExpression[_90∈6]<br /><__relation...scription”>"]:::plan
    PgClassExpression_91["PgClassExpression[_91∈6]<br /><__relation...s__.”note”>"]:::plan
    First_97["First[_97∈3]"]:::plan
    PgSelectSingle_98["PgSelectSingle[_98∈7]<br /><relational_dividers>"]:::plan
    PgClassExpression_115["PgClassExpression[_115∈7]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_116["PgClassExpression[_116∈7]<br /><__relation...__.”color”>"]:::plan
    First_122["First[_122∈3]"]:::plan
    PgSelectSingle_123["PgSelectSingle[_123∈8]<br /><relational_checklists>"]:::plan
    PgClassExpression_140["PgClassExpression[_140∈8]<br /><__relation...__.”title”>"]:::plan
    First_146["First[_146∈3]"]:::plan
    PgSelectSingle_147["PgSelectSingle[_147∈9]<br /><relational_checklist_items>"]:::plan
    PgClassExpression_164["PgClassExpression[_164∈9]<br /><__relation...scription”>"]:::plan
    PgClassExpression_165["PgClassExpression[_165∈9]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈3]<br /><__relation...__.”type2”>"]:::plan
    First_174["First[_174∈3]"]:::plan
    PgSelectSingle_175["PgSelectSingle[_175∈3]<br /><people>"]:::plan
    PgClassExpression_176["PgClassExpression[_176∈3]<br /><__people__.”username”>"]:::plan
    PgClassExpression_177["PgClassExpression[_177∈3]<br /><__relation...”position”>"]:::plan
    PgClassExpression_178["PgClassExpression[_178∈3]<br /><__relation...reated_at”>"]:::plan
    PgClassExpression_179["PgClassExpression[_179∈3]<br /><__relation...pdated_at”>"]:::plan
    PgClassExpression_180["PgClassExpression[_180∈3]<br /><__relation..._archived”>"]:::plan
    PgClassExpression_181["PgClassExpression[_181∈3]<br /><__relation...chived_at”>"]:::plan
    PgClassExpression_182["PgClassExpression[_182∈4]<br /><__relation...__.”title”>"]:::plan
    First_188["First[_188∈3]"]:::plan
    PgSelectSingle_189["PgSelectSingle[_189∈10]<br /><relational_posts>"]:::plan
    PgClassExpression_339["PgClassExpression[_339∈10]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈10]<br /><__relation...scription”>"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈10]<br /><__relation...s__.”note”>"]:::plan
    First_347["First[_347∈3]"]:::plan
    PgSelectSingle_348["PgSelectSingle[_348∈11]<br /><relational_dividers>"]:::plan
    PgClassExpression_498["PgClassExpression[_498∈11]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_499["PgClassExpression[_499∈11]<br /><__relation...__.”color”>"]:::plan
    First_505["First[_505∈3]"]:::plan
    PgSelectSingle_506["PgSelectSingle[_506∈12]<br /><relational_checklists>"]:::plan
    PgClassExpression_656["PgClassExpression[_656∈12]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_657["PgClassExpression[_657∈3]<br /><__relation...ems__.”id”>"]:::plan
    First_662["First[_662∈3]"]:::plan
    PgSelectSingle_663["PgSelectSingle[_663∈13]<br /><relational_checklist_items>"]:::plan
    PgClassExpression_772["PgClassExpression[_772∈3]<br /><__relation...ems__.”id”>"]:::plan
    Access_802["Access[_802∈0]<br /><_3.pgSettings>"]:::plan
    Access_803["Access[_803∈0]<br /><_3.withPgClient>"]:::plan
    Object_804["Object[_804∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    PgClassExpression_813["PgClassExpression[_813∈13]<br /><__relation...scription”>"]:::plan
    PgClassExpression_814["PgClassExpression[_814∈13]<br /><__relation...s__.”note”>"]:::plan
    Map_815["Map[_815∈3]<br /><_23:{”0”:1,”1”:2}>"]:::plan
    List_816["List[_816∈3]<br /><_815>"]:::plan
    Map_817["Map[_817∈3]<br /><_23:{”0”:3,”1”:4,”2”:5,”3”:6}>"]:::plan
    List_818["List[_818∈3]<br /><_817>"]:::plan
    Map_819["Map[_819∈3]<br /><_23:{”0”:7,”1”:8,”2”:9}>"]:::plan
    List_820["List[_820∈3]<br /><_819>"]:::plan
    Map_821["Map[_821∈3]<br /><_23:{”0”:10,”1”:11}>"]:::plan
    List_822["List[_822∈3]<br /><_821>"]:::plan
    Map_823["Map[_823∈3]<br /><_23:{”0”:12,”1”:13}>"]:::plan
    List_824["List[_824∈3]<br /><_823>"]:::plan
    Map_825["Map[_825∈3]<br /><_39:{”0”:1,”1”:2}>"]:::plan
    List_826["List[_826∈3]<br /><_825>"]:::plan
    Map_827["Map[_827∈3]<br /><_39:{”0”:3,”1”:4,”2”:5,”3”:6}>"]:::plan
    List_828["List[_828∈3]<br /><_827>"]:::plan
    Map_829["Map[_829∈3]<br /><_39:{”0”:7,”1”:8,”2”:9}>"]:::plan
    List_830["List[_830∈3]<br /><_829>"]:::plan
    Map_831["Map[_831∈3]<br /><_39:{”0”:10,”1”:11}>"]:::plan
    List_832["List[_832∈3]<br /><_831>"]:::plan
    Map_833["Map[_833∈3]<br /><_39:{”0”:12,”1”:13}>"]:::plan
    List_834["List[_834∈3]<br /><_833>"]:::plan
    Map_835["Map[_835∈3]<br /><_39:{”0”:16}>"]:::plan
    List_836["List[_836∈3]<br /><_835>"]:::plan
    Map_837["Map[_837∈3]<br /><_23:{”0”:15,”1”:16,”2”:17,”3”:18,”4”:19,”5”:20,”6”:21,”7”:22,”8”:23,”9”:24,”10”:25,”11”:26,”12”:27,”13”:28,”14”:29,”15”:30,”16”:31,”17”:32,”18”:33,”19”:34,”20”:35,”21”:36}>"]:::plan
    List_838["List[_838∈3]<br /><_837>"]:::plan
    Map_839["Map[_839∈3]<br /><_23:{”0”:38}>"]:::plan
    List_840["List[_840∈3]<br /><_839>"]:::plan
    Access_841["Access[_841∈1]<br /><_11.1>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_804 --> PgSelect_7
    PgSelect_7 ==> __Item_11
    __Item_11 --> PgSelectSingle_12
    PgSelectSingle_12 --> PgClassExpression_13
    Access_841 --> __ListTransform_19
    PgSelectSingle_21 -.-> __ListTransform_19
    Access_841 -.-> __Item_20
    __Item_20 --> PgSelectSingle_21
    __ListTransform_19 ==> __Item_22
    __Item_22 --> PgSelectSingle_23
    PgSelectSingle_23 --> PgClassExpression_24
    PgSelectSingle_23 --> PgPolymorphic_25
    PgClassExpression_24 --> PgPolymorphic_25
    List_816 --> First_31
    First_31 --> PgSelectSingle_32
    List_838 --> First_38
    First_38 --> PgSelectSingle_39
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_39 --> PgPolymorphic_41
    PgClassExpression_40 --> PgPolymorphic_41
    List_826 --> First_47
    First_47 --> PgSelectSingle_48
    PgSelectSingle_39 --> PgClassExpression_51
    List_836 --> First_57
    First_57 --> PgSelectSingle_58
    PgSelectSingle_58 --> PgClassExpression_59
    PgSelectSingle_39 --> PgClassExpression_60
    PgSelectSingle_39 --> PgClassExpression_61
    PgSelectSingle_39 --> PgClassExpression_62
    PgSelectSingle_39 --> PgClassExpression_63
    PgSelectSingle_39 --> PgClassExpression_64
    PgSelectSingle_48 --> PgClassExpression_65
    List_828 --> First_71
    First_71 --> PgSelectSingle_72
    PgSelectSingle_72 --> PgClassExpression_89
    PgSelectSingle_72 --> PgClassExpression_90
    PgSelectSingle_72 --> PgClassExpression_91
    List_830 --> First_97
    First_97 --> PgSelectSingle_98
    PgSelectSingle_98 --> PgClassExpression_115
    PgSelectSingle_98 --> PgClassExpression_116
    List_832 --> First_122
    First_122 --> PgSelectSingle_123
    PgSelectSingle_123 --> PgClassExpression_140
    List_834 --> First_146
    First_146 --> PgSelectSingle_147
    PgSelectSingle_147 --> PgClassExpression_164
    PgSelectSingle_147 --> PgClassExpression_165
    PgSelectSingle_23 --> PgClassExpression_168
    List_840 --> First_174
    First_174 --> PgSelectSingle_175
    PgSelectSingle_175 --> PgClassExpression_176
    PgSelectSingle_23 --> PgClassExpression_177
    PgSelectSingle_23 --> PgClassExpression_178
    PgSelectSingle_23 --> PgClassExpression_179
    PgSelectSingle_23 --> PgClassExpression_180
    PgSelectSingle_23 --> PgClassExpression_181
    PgSelectSingle_32 --> PgClassExpression_182
    List_818 --> First_188
    First_188 --> PgSelectSingle_189
    PgSelectSingle_189 --> PgClassExpression_339
    PgSelectSingle_189 --> PgClassExpression_340
    PgSelectSingle_189 --> PgClassExpression_341
    List_820 --> First_347
    First_347 --> PgSelectSingle_348
    PgSelectSingle_348 --> PgClassExpression_498
    PgSelectSingle_348 --> PgClassExpression_499
    List_822 --> First_505
    First_505 --> PgSelectSingle_506
    PgSelectSingle_506 --> PgClassExpression_656
    PgSelectSingle_23 --> PgClassExpression_657
    List_824 --> First_662
    First_662 --> PgSelectSingle_663
    PgSelectSingle_39 --> PgClassExpression_772
    __Value_3 --> Access_802
    __Value_3 --> Access_803
    Access_802 --> Object_804
    Access_803 --> Object_804
    PgSelectSingle_663 --> PgClassExpression_813
    PgSelectSingle_663 --> PgClassExpression_814
    PgSelectSingle_23 --> Map_815
    Map_815 --> List_816
    PgSelectSingle_23 --> Map_817
    Map_817 --> List_818
    PgSelectSingle_23 --> Map_819
    Map_819 --> List_820
    PgSelectSingle_23 --> Map_821
    Map_821 --> List_822
    PgSelectSingle_23 --> Map_823
    Map_823 --> List_824
    PgSelectSingle_39 --> Map_825
    Map_825 --> List_826
    PgSelectSingle_39 --> Map_827
    Map_827 --> List_828
    PgSelectSingle_39 --> Map_829
    Map_829 --> List_830
    PgSelectSingle_39 --> Map_831
    Map_831 --> List_832
    PgSelectSingle_39 --> Map_833
    Map_833 --> List_834
    PgSelectSingle_39 --> Map_835
    Map_835 --> List_836
    PgSelectSingle_23 --> Map_837
    Map_837 --> List_838
    PgSelectSingle_23 --> Map_839
    Map_839 --> List_840
    __Item_11 --> Access_841

    %% plan-to-path relationships
    P1["~"]
    __TrackedObject_6 -.-> P1
    P2[">people"]
    PgSelect_7 -.-> P2
    P3[">people[]"]
    PgSelectSingle_12 -.-> P3
    P4[">p…]>username"]
    PgClassExpression_13 -.-> P4
    P5[">p…]>items@_19[]"]
    PgSelectSingle_21 -.-> P5
    P6[">p…]>items"]
    __ListTransform_19 -.-> P6
    P7[">p…]>items[]"]
    PgPolymorphic_25 -.-> P7
    P8[">p…]>i…]>parent x5"]
    PgPolymorphic_41 -.-> P8
    P9[">p…]>i…]>p…t>id x25"]
    PgClassExpression_772 -.-> P9
    P10[">p…]>i…]>p…t>type x25"]
    PgClassExpression_40 -.-> P10
    P11[">p…]>i…]>p…t>type2 x25"]
    PgClassExpression_51 -.-> P11
    P12[">p…]>i…]>p…t>author x25"]
    PgSelectSingle_58 -.-> P12
    P13[">p…]>i…]>p…t>a…r>username x25"]
    PgClassExpression_59 -.-> P13
    P14[">p…]>i…]>p…t>position x25"]
    PgClassExpression_60 -.-> P14
    P15[">p…]>i…]>p…t>createdAt x25"]
    PgClassExpression_61 -.-> P15
    P16[">p…]>i…]>p…t>updatedAt x25"]
    PgClassExpression_62 -.-> P16
    P17[">p…]>i…]>p…t>isExplicitlyArchived x25"]
    PgClassExpression_63 -.-> P17
    P18[">p…]>i…]>p…t>archivedAt x25"]
    PgClassExpression_64 -.-> P18
    P19[">p…]>i…]>p…t>title x5"]
    PgClassExpression_65 -.-> P19
    P20[">p…]>i…]>p…t>title x5"]
    PgClassExpression_89 -.-> P20
    P21[">p…]>i…]>p…t>description x5"]
    PgClassExpression_90 -.-> P21
    P22[">p…]>i…]>p…t>note x5"]
    PgClassExpression_91 -.-> P22
    P23[">p…]>i…]>p…t>title x5"]
    PgClassExpression_115 -.-> P23
    P24[">p…]>i…]>p…t>color x5"]
    PgClassExpression_116 -.-> P24
    P25[">p…]>i…]>p…t>title x5"]
    PgClassExpression_140 -.-> P25
    P26[">p…]>i…]>p…t>description x5"]
    PgClassExpression_164 -.-> P26
    P27[">p…]>i…]>p…t>note x5"]
    PgClassExpression_165 -.-> P27
    P28[">p…]>i…]>id x5"]
    PgClassExpression_657 -.-> P28
    P29[">p…]>i…]>type x5"]
    PgClassExpression_24 -.-> P29
    P30[">p…]>i…]>type2 x5"]
    PgClassExpression_168 -.-> P30
    P31[">p…]>i…]>author x5"]
    PgSelectSingle_175 -.-> P31
    P32[">p…]>i…]>a…r>username x5"]
    PgClassExpression_176 -.-> P32
    P33[">p…]>i…]>position x5"]
    PgClassExpression_177 -.-> P33
    P34[">p…]>i…]>createdAt x5"]
    PgClassExpression_178 -.-> P34
    P35[">p…]>i…]>updatedAt x5"]
    PgClassExpression_179 -.-> P35
    P36[">p…]>i…]>isExplicitlyArchived x5"]
    PgClassExpression_180 -.-> P36
    P37[">p…]>i…]>archivedAt x5"]
    PgClassExpression_181 -.-> P37
    P38[">p…]>i…]>title"]
    PgClassExpression_182 -.-> P38
    P39[">p…]>i…]>title"]
    PgClassExpression_339 -.-> P39
    P40[">p…]>i…]>description"]
    PgClassExpression_340 -.-> P40
    P41[">p…]>i…]>note"]
    PgClassExpression_341 -.-> P41
    P42[">p…]>i…]>title"]
    PgClassExpression_498 -.-> P42
    P43[">p…]>i…]>color"]
    PgClassExpression_499 -.-> P43
    P44[">p…]>i…]>title"]
    PgClassExpression_656 -.-> P44
    P45[">p…]>i…]>description"]
    PgClassExpression_813 -.-> P45
    P46[">p…]>i…]>note"]
    PgClassExpression_814 -.-> P46

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,PgSelect_7,Access_802,Access_803,Object_804 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Item_11,PgSelectSingle_12,PgClassExpression_13,__ListTransform_19,Access_841 bucket1
    classDef bucket2 stroke:#808000
    class __Item_20,PgSelectSingle_21 bucket2
    classDef bucket3 stroke:#3cb371
    class __Item_22,PgSelectSingle_23,PgClassExpression_24,PgPolymorphic_25,First_31,First_38,PgSelectSingle_39,PgClassExpression_40,PgPolymorphic_41,First_47,PgClassExpression_51,First_57,PgSelectSingle_58,PgClassExpression_59,PgClassExpression_60,PgClassExpression_61,PgClassExpression_62,PgClassExpression_63,PgClassExpression_64,First_71,First_97,First_122,First_146,PgClassExpression_168,First_174,PgSelectSingle_175,PgClassExpression_176,PgClassExpression_177,PgClassExpression_178,PgClassExpression_179,PgClassExpression_180,PgClassExpression_181,First_188,First_347,First_505,PgClassExpression_657,First_662,PgClassExpression_772,Map_815,List_816,Map_817,List_818,Map_819,List_820,Map_821,List_822,Map_823,List_824,Map_825,List_826,Map_827,List_828,Map_829,List_830,Map_831,List_832,Map_833,List_834,Map_835,List_836,Map_837,List_838,Map_839,List_840 bucket3
    classDef bucket4 stroke:#7f007f
    class PgSelectSingle_32,PgClassExpression_182 bucket4
    classDef bucket5 stroke:#ff0000
    class PgSelectSingle_48,PgClassExpression_65 bucket5
    classDef bucket6 stroke:#ffa500
    class PgSelectSingle_72,PgClassExpression_89,PgClassExpression_90,PgClassExpression_91 bucket6
    classDef bucket7 stroke:#ffff00
    class PgSelectSingle_98,PgClassExpression_115,PgClassExpression_116 bucket7
    classDef bucket8 stroke:#7fff00
    class PgSelectSingle_123,PgClassExpression_140 bucket8
    classDef bucket9 stroke:#4169e1
    class PgSelectSingle_147,PgClassExpression_164,PgClassExpression_165 bucket9
    classDef bucket10 stroke:#00ffff
    class PgSelectSingle_189,PgClassExpression_339,PgClassExpression_340,PgClassExpression_341 bucket10
    classDef bucket11 stroke:#00bfff
    class PgSelectSingle_348,PgClassExpression_498,PgClassExpression_499 bucket11
    classDef bucket12 stroke:#0000ff
    class PgSelectSingle_506,PgClassExpression_656 bucket12
    classDef bucket13 stroke:#ff00ff
    class PgSelectSingle_663,PgClassExpression_813,PgClassExpression_814 bucket13

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
    Bucket5("Bucket 5 (polymorphic_41[RelationalTopic])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent"):::bucket
    style Bucket5 stroke:#ff0000
    Bucket3 --> Bucket5
    Bucket6("Bucket 6 (polymorphic_41[RelationalPost])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent"):::bucket
    style Bucket6 stroke:#ffa500
    Bucket3 --> Bucket6
    Bucket7("Bucket 7 (polymorphic_41[RelationalDivider])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent"):::bucket
    style Bucket7 stroke:#ffff00
    Bucket3 --> Bucket7
    Bucket8("Bucket 8 (polymorphic_41[RelationalChecklist])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent"):::bucket
    style Bucket8 stroke:#7fff00
    Bucket3 --> Bucket8
    Bucket9("Bucket 9 (polymorphic_41[RelationalChecklistItem])<br />~>Query.people[]>Person.items[]>RelationalPost.parent<br />~>Query.people[]>Person.items[]>RelationalTopic.parent<br />~>Query.people[]>Person.items[]>RelationalDivider.parent<br />~>Query.people[]>Person.items[]>RelationalChecklist.parent<br />~>Query.people[]>Person.items[]>RelationalChecklistItem.parent"):::bucket
    style Bucket9 stroke:#4169e1
    Bucket3 --> Bucket9
    Bucket10("Bucket 10 (polymorphic_25[RelationalPost])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket10 stroke:#00ffff
    Bucket3 --> Bucket10
    Bucket11("Bucket 11 (polymorphic_25[RelationalDivider])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket11 stroke:#00bfff
    Bucket3 --> Bucket11
    Bucket12("Bucket 12 (polymorphic_25[RelationalChecklist])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket12 stroke:#0000ff
    Bucket3 --> Bucket12
    Bucket13("Bucket 13 (polymorphic_25[RelationalChecklistItem])<br />~>Query.people[]>Person.items[]"):::bucket
    style Bucket13 stroke:#ff00ff
    Bucket3 --> Bucket13
    end
```