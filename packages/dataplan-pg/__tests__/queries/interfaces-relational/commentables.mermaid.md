```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    PgPolymorphic_18["PgPolymorphic[_18∈2]"]:::plan
    PgClassExpression_17["PgClassExpression[_17∈2]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_26["PgClassExpression[_26∈3]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgClassExpression_34["PgClassExpression[_34∈3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_42["PgClassExpression[_42∈3]<br />ᐸ__relation...__.”type2”ᐳ"]:::plan
    PgClassExpression_50["PgClassExpression[_50∈3]<br />ᐸ__relation...”position”ᐳ"]:::plan
    PgSelectSingle_33["PgSelectSingle[_33∈3]<br />ᐸrelational_itemsᐳ"]:::plan
    Map_121["Map[_121∈3]<br />ᐸ_25:{”0”:0,”1”:1,”2”:2}ᐳ"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_52["PgClassExpression[_52∈3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_53["PgClassExpression[_53∈3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_25["PgSelectSingle[_25∈3]<br />ᐸrelational_postsᐳ"]:::plan
    Map_123["Map[_123∈2]<br />ᐸ_16:{”0”:1,”1”:2,”2”:3,”3”:4,”4”:5,”5”:6,”6”:7}ᐳ"]:::plan
    PgClassExpression_61["PgClassExpression[_61∈4]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgClassExpression_69["PgClassExpression[_69∈4]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_77["PgClassExpression[_77∈4]<br />ᐸ__relation...__.”type2”ᐳ"]:::plan
    PgClassExpression_85["PgClassExpression[_85∈4]<br />ᐸ__relation...”position”ᐳ"]:::plan
    PgSelectSingle_68["PgSelectSingle[_68∈4]<br />ᐸrelational_itemsᐳ"]:::plan
    Map_125["Map[_125∈4]<br />ᐸ_60:{”0”:0,”1”:1,”2”:2}ᐳ"]:::plan
    PgClassExpression_86["PgClassExpression[_86∈4]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgSelectSingle_60["PgSelectSingle[_60∈4]<br />ᐸrelational_checklistsᐳ"]:::plan
    Map_127["Map[_127∈2]<br />ᐸ_16:{”0”:8,”1”:9,”2”:10,”3”:11,”4”:12}ᐳ"]:::plan
    PgClassExpression_94["PgClassExpression[_94∈5]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgClassExpression_102["PgClassExpression[_102∈5]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression_110["PgClassExpression[_110∈5]<br />ᐸ__relation...__.”type2”ᐳ"]:::plan
    PgClassExpression_118["PgClassExpression[_118∈5]<br />ᐸ__relation...”position”ᐳ"]:::plan
    PgSelectSingle_101["PgSelectSingle[_101∈5]<br />ᐸrelational_itemsᐳ"]:::plan
    Map_129["Map[_129∈5]<br />ᐸ_93:{”0”:0,”1”:1,”2”:2}ᐳ"]:::plan
    PgClassExpression_119["PgClassExpression[_119∈5]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_120["PgClassExpression[_120∈5]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle_93["PgSelectSingle[_93∈5]<br />ᐸrelational_checklist_itemsᐳ"]:::plan
    Map_131["Map[_131∈2]<br />ᐸ_16:{”0”:13,”1”:14,”2”:15,”3”:16,”4”:17,”5”:18}ᐳ"]:::plan
    PgSelectSingle_16["PgSelectSingle[_16∈2]<br />ᐸrelational_commentablesᐳ"]:::plan
    __Item_15>"__Item[_15∈2]<br />ᐸ_12ᐳ"]:::itemplan
    __ListTransform_12["__ListTransform[_12∈0]<br />ᐸeach:_8ᐳ"]:::plan
    PgSelectSingle_14["PgSelectSingle[_14∈1]<br />ᐸrelational_commentablesᐳ"]:::plan
    __Item_13>"__Item[_13∈1]<br />ᐸ_8ᐳ"]:::itemplan
    PgSelect_8[["PgSelect[_8∈0]<br />ᐸrelational_commentablesᐳ"]]:::plan
    Object_115["Object[_115∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_113["Access[_113∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_114["Access[_114∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan

    %% plan dependencies
    PgSelectSingle_16 & PgClassExpression_17 --> PgPolymorphic_18
    PgSelectSingle_16 --> PgClassExpression_17
    PgSelectSingle_25 --> PgClassExpression_26
    PgSelectSingle_33 --> PgClassExpression_34
    PgSelectSingle_33 --> PgClassExpression_42
    PgSelectSingle_33 --> PgClassExpression_50
    Map_121 --> PgSelectSingle_33
    PgSelectSingle_25 --> Map_121
    PgSelectSingle_25 --> PgClassExpression_51
    PgSelectSingle_25 --> PgClassExpression_52
    PgSelectSingle_25 --> PgClassExpression_53
    Map_123 --> PgSelectSingle_25
    PgSelectSingle_16 --> Map_123
    PgSelectSingle_60 --> PgClassExpression_61
    PgSelectSingle_68 --> PgClassExpression_69
    PgSelectSingle_68 --> PgClassExpression_77
    PgSelectSingle_68 --> PgClassExpression_85
    Map_125 --> PgSelectSingle_68
    PgSelectSingle_60 --> Map_125
    PgSelectSingle_60 --> PgClassExpression_86
    Map_127 --> PgSelectSingle_60
    PgSelectSingle_16 --> Map_127
    PgSelectSingle_93 --> PgClassExpression_94
    PgSelectSingle_101 --> PgClassExpression_102
    PgSelectSingle_101 --> PgClassExpression_110
    PgSelectSingle_101 --> PgClassExpression_118
    Map_129 --> PgSelectSingle_101
    PgSelectSingle_93 --> Map_129
    PgSelectSingle_93 --> PgClassExpression_119
    PgSelectSingle_93 --> PgClassExpression_120
    Map_131 --> PgSelectSingle_93
    PgSelectSingle_16 --> Map_131
    __Item_15 --> PgSelectSingle_16
    __ListTransform_12 ==> __Item_15
    PgSelect_8 --> __ListTransform_12
    PgSelectSingle_14 -.-> __ListTransform_12
    __Item_13 --> PgSelectSingle_14
    PgSelect_8 -.-> __Item_13
    Object_115 --> PgSelect_8
    Access_113 & Access_114 --> Object_115
    __Value_3 --> Access_113
    __Value_3 --> Access_114

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_12["ᐳallRelationalCommentablesList"]
    __ListTransform_12 -.-> P_12
    P_14["ᐳallRelationalCommentablesList@_12[]"]
    PgSelectSingle_14 -.-> P_14
    P_18["ᐳallRelationalCommentablesList[]"]
    PgPolymorphic_18 -.-> P_18
    P_26["ᐳa…]ᐳid"]
    PgClassExpression_26 -.-> P_26
    P_34["ᐳa…]ᐳtype"]
    PgClassExpression_34 -.-> P_34
    P_42["ᐳa…]ᐳtype2"]
    PgClassExpression_42 -.-> P_42
    P_50["ᐳa…]ᐳposition"]
    PgClassExpression_50 -.-> P_50
    P_51["ᐳa…]ᐳtitle"]
    PgClassExpression_51 -.-> P_51
    P_52["ᐳa…]ᐳdescription"]
    PgClassExpression_52 -.-> P_52
    P_53["ᐳa…]ᐳnote"]
    PgClassExpression_53 -.-> P_53
    P_61["ᐳa…]ᐳid"]
    PgClassExpression_61 -.-> P_61
    P_69["ᐳa…]ᐳtype"]
    PgClassExpression_69 -.-> P_69
    P_77["ᐳa…]ᐳtype2"]
    PgClassExpression_77 -.-> P_77
    P_85["ᐳa…]ᐳposition"]
    PgClassExpression_85 -.-> P_85
    P_86["ᐳa…]ᐳtitle"]
    PgClassExpression_86 -.-> P_86
    P_94["ᐳa…]ᐳid"]
    PgClassExpression_94 -.-> P_94
    P_102["ᐳa…]ᐳtype"]
    PgClassExpression_102 -.-> P_102
    P_110["ᐳa…]ᐳtype2"]
    PgClassExpression_110 -.-> P_110
    P_118["ᐳa…]ᐳposition"]
    PgClassExpression_118 -.-> P_118
    P_119["ᐳa…]ᐳdescription"]
    PgClassExpression_119 -.-> P_119
    P_120["ᐳa…]ᐳnote"]
    PgClassExpression_120 -.-> P_120

    subgraph "Buckets for queries/interfaces-relational/commentables"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀allRelationalCommentablesList ᐸ-A- _12"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,PgSelect_8,__ListTransform_12,Access_113,Access_114,Object_115 bucket0
    Bucket1("Bucket 1 (item_13)<br />Deps: _8"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_13,PgSelectSingle_14 bucket1
    Bucket2("Bucket 2 (item_15)<br />Deps: _12<br />~ᐳQuery.allRelationalCommentablesList[]<br />⠀ROOT ᐸ-O- _18"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item_15,PgSelectSingle_16,PgClassExpression_17,PgPolymorphic_18,Map_123,Map_127,Map_131 bucket2
    Bucket3("Bucket 3 (polymorphic_18[RelationalPost])<br />Deps: _123<br />~ᐳQuery.allRelationalCommentablesList[]<br />⠀⠀id ᐸ-L- _26<br />⠀⠀type ᐸ-L- _34<br />⠀⠀type2 ᐸ-L- _42<br />⠀⠀position ᐸ-L- _50<br />⠀⠀title ᐸ-L- _51<br />⠀⠀description ᐸ-L- _52<br />⠀⠀note ᐸ-L- _53"):::bucket
    classDef bucket3 stroke:#ffa500
    class Bucket3,PgSelectSingle_25,PgClassExpression_26,PgSelectSingle_33,PgClassExpression_34,PgClassExpression_42,PgClassExpression_50,PgClassExpression_51,PgClassExpression_52,PgClassExpression_53,Map_121 bucket3
    Bucket4("Bucket 4 (polymorphic_18[RelationalChecklist])<br />Deps: _127<br />~ᐳQuery.allRelationalCommentablesList[]<br />⠀⠀id ᐸ-L- _61<br />⠀⠀type ᐸ-L- _69<br />⠀⠀type2 ᐸ-L- _77<br />⠀⠀position ᐸ-L- _85<br />⠀⠀title ᐸ-L- _86"):::bucket
    classDef bucket4 stroke:#0000ff
    class Bucket4,PgSelectSingle_60,PgClassExpression_61,PgSelectSingle_68,PgClassExpression_69,PgClassExpression_77,PgClassExpression_85,PgClassExpression_86,Map_125 bucket4
    Bucket5("Bucket 5 (polymorphic_18[RelationalChecklistItem])<br />Deps: _131<br />~ᐳQuery.allRelationalCommentablesList[]<br />⠀⠀id ᐸ-L- _94<br />⠀⠀type ᐸ-L- _102<br />⠀⠀type2 ᐸ-L- _110<br />⠀⠀position ᐸ-L- _118<br />⠀⠀description ᐸ-L- _119<br />⠀⠀note ᐸ-L- _120"):::bucket
    classDef bucket5 stroke:#7fff00
    class Bucket5,PgSelectSingle_93,PgClassExpression_94,PgSelectSingle_101,PgClassExpression_102,PgClassExpression_110,PgClassExpression_118,PgClassExpression_119,PgClassExpression_120,Map_129 bucket5
    Bucket0 --> Bucket1 & Bucket2
    Bucket2 --> Bucket3 & Bucket4 & Bucket5
    end
```
