```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px


    %% define plans
    __Value_3["__Value[_3∈1@1]<br /><context>"]:::plan
    __Value_5["__Value[_5∈0]<br /><rootValue>"]:::plan
    __TrackedObject_6["__TrackedObject[_6∈0]"]:::plan
    Constant_7["Constant[_7∈1@1]"]:::plan
    Constant_8["Constant[_8∈1@1]"]:::plan
    PgSelect_9[["PgSelect[_9∈1@1]<br /><relational_posts>"]]:::sideeffectplan
    Constant_13["Constant[_13∈1@1]"]:::plan
    Constant_14["Constant[_14∈1@1]"]:::plan
    PgSelect_15[["PgSelect[_15∈1@1]<br /><relational_posts>"]]:::sideeffectplan
    Constant_19["Constant[_19∈1@1]"]:::plan
    Constant_20["Constant[_20∈1@1]"]:::plan
    PgSelect_21[["PgSelect[_21∈1@1]<br /><relational_posts>"]]:::sideeffectplan
    First_25["First[_25∈1@1]"]:::plan
    PgSelectSingle_26["PgSelectSingle[_26∈1@1]<br /><relational_posts>"]:::plan
    PgClassExpression_27["PgClassExpression[_27∈1@1]<br /><__relational_posts__>"]:::plan
    InputStaticLeaf_28["InputStaticLeaf[_28∈1@1]"]:::plan
    PgSelect_29[["PgSelect[_29∈1@1]<br /><relational_items>"]]:::plan
    First_33["First[_33∈1@1]"]:::plan
    PgSelectSingle_34["PgSelectSingle[_34∈1@1]<br /><relational_items>"]:::plan
    PgClassExpression_35["PgClassExpression[_35∈1@1]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_36["PgPolymorphic[_36∈1@1]"]:::plan
    First_50["First[_50∈1@1]"]:::plan
    PgSelectSingle_51["PgSelectSingle[_51∈2@1]<br /><relational_posts>"]:::plan
    PgClassExpression_53["PgClassExpression[_53∈2@1]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_54["PgClassExpression[_54∈2@1]<br /><__relation...scription”>"]:::plan
    PgClassExpression_55["PgClassExpression[_55∈2@1]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_72["PgClassExpression[_72∈1@1]<br /><__relation...ems__.”id”>"]:::plan
    InputStaticLeaf_80["InputStaticLeaf[_80∈1@1]"]:::plan
    PgSelect_81[["PgSelect[_81∈1@1]<br /><relational_items>"]]:::plan
    First_85["First[_85∈1@1]"]:::plan
    PgSelectSingle_86["PgSelectSingle[_86∈1@1]<br /><relational_items>"]:::plan
    PgClassExpression_87["PgClassExpression[_87∈1@1]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_88["PgPolymorphic[_88∈1@1]"]:::plan
    First_102["First[_102∈1@1]"]:::plan
    PgSelectSingle_103["PgSelectSingle[_103∈3@1]<br /><relational_posts>"]:::plan
    PgClassExpression_105["PgClassExpression[_105∈3@1]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_106["PgClassExpression[_106∈3@1]<br /><__relation...scription”>"]:::plan
    PgClassExpression_107["PgClassExpression[_107∈3@1]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_124["PgClassExpression[_124∈1@1]<br /><__relation...ems__.”id”>"]:::plan
    InputStaticLeaf_132["InputStaticLeaf[_132∈1@1]"]:::plan
    PgSelect_133[["PgSelect[_133∈1@1]<br /><relational_items>"]]:::plan
    First_137["First[_137∈1@1]"]:::plan
    PgSelectSingle_138["PgSelectSingle[_138∈1@1]<br /><relational_items>"]:::plan
    PgClassExpression_139["PgClassExpression[_139∈1@1]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_140["PgPolymorphic[_140∈1@1]"]:::plan
    First_154["First[_154∈1@1]"]:::plan
    PgSelectSingle_155["PgSelectSingle[_155∈4@1]<br /><relational_posts>"]:::plan
    PgClassExpression_157["PgClassExpression[_157∈4@1]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_158["PgClassExpression[_158∈4@1]<br /><__relation...scription”>"]:::plan
    PgClassExpression_159["PgClassExpression[_159∈4@1]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_176["PgClassExpression[_176∈1@1]<br /><__relation...ems__.”id”>"]:::plan
    Access_178["Access[_178∈1@1]<br /><_3.pgSettings>"]:::plan
    Access_179["Access[_179∈1@1]<br /><_3.withPgClient>"]:::plan
    Object_180["Object[_180∈1@1]<br /><{pgSettings,withPgClient}>"]:::plan
    Map_184["Map[_184∈1@1]<br /><_34:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_185["List[_185∈1@1]<br /><_184>"]:::plan
    Map_186["Map[_186∈1@1]<br /><_86:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_187["List[_187∈1@1]<br /><_186>"]:::plan
    Map_188["Map[_188∈1@1]<br /><_138:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_189["List[_189∈1@1]<br /><_188>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_180 --> PgSelect_9
    Constant_7 --> PgSelect_9
    Constant_8 --> PgSelect_9
    Object_180 --> PgSelect_15
    Constant_13 --> PgSelect_15
    Constant_14 --> PgSelect_15
    Object_180 --> PgSelect_21
    Constant_19 --> PgSelect_21
    Constant_20 --> PgSelect_21
    PgSelect_21 --> First_25
    First_25 --> PgSelectSingle_26
    PgSelectSingle_26 --> PgClassExpression_27
    Object_180 --> PgSelect_29
    InputStaticLeaf_28 --> PgSelect_29
    PgSelect_29 --> First_33
    First_33 --> PgSelectSingle_34
    PgSelectSingle_34 --> PgClassExpression_35
    PgSelectSingle_34 --> PgPolymorphic_36
    PgClassExpression_35 --> PgPolymorphic_36
    List_185 --> First_50
    First_50 --> PgSelectSingle_51
    PgSelectSingle_51 --> PgClassExpression_53
    PgSelectSingle_51 --> PgClassExpression_54
    PgSelectSingle_51 --> PgClassExpression_55
    PgSelectSingle_34 --> PgClassExpression_72
    Object_180 --> PgSelect_81
    InputStaticLeaf_80 --> PgSelect_81
    PgSelect_81 --> First_85
    First_85 --> PgSelectSingle_86
    PgSelectSingle_86 --> PgClassExpression_87
    PgSelectSingle_86 --> PgPolymorphic_88
    PgClassExpression_87 --> PgPolymorphic_88
    List_187 --> First_102
    First_102 --> PgSelectSingle_103
    PgSelectSingle_103 --> PgClassExpression_105
    PgSelectSingle_103 --> PgClassExpression_106
    PgSelectSingle_103 --> PgClassExpression_107
    PgSelectSingle_86 --> PgClassExpression_124
    Object_180 --> PgSelect_133
    InputStaticLeaf_132 --> PgSelect_133
    PgSelect_133 --> First_137
    First_137 --> PgSelectSingle_138
    PgSelectSingle_138 --> PgClassExpression_139
    PgSelectSingle_138 --> PgPolymorphic_140
    PgClassExpression_139 --> PgPolymorphic_140
    List_189 --> First_154
    First_154 --> PgSelectSingle_155
    PgSelectSingle_155 --> PgClassExpression_157
    PgSelectSingle_155 --> PgClassExpression_158
    PgSelectSingle_155 --> PgClassExpression_159
    PgSelectSingle_138 --> PgClassExpression_176
    __Value_3 --> Access_178
    __Value_3 --> Access_179
    Access_178 --> Object_180
    Access_179 --> Object_180
    PgSelectSingle_34 --> Map_184
    Map_184 --> List_185
    PgSelectSingle_86 --> Map_186
    Map_186 --> List_187
    PgSelectSingle_138 --> Map_188
    Map_188 --> List_189

    %% plan-to-path relationships
    P_5[">c…d>query"]
    __Value_5 -.-> P_5
    P_6["~"]
    __TrackedObject_6 -.-> P_6
    P_27[">createThreeRelationalPostsComputed"]
    PgClassExpression_27 -.-> P_27
    P_36[">c…d>q…y>i1"]
    PgPolymorphic_36 -.-> P_36
    P_53[">c…d>q…y>i1>title"]
    PgClassExpression_53 -.-> P_53
    P_54[">c…d>q…y>i1>description"]
    PgClassExpression_54 -.-> P_54
    P_55[">c…d>q…y>i1>note"]
    PgClassExpression_55 -.-> P_55
    P_72[">c…d>q…y>i1>id x5"]
    PgClassExpression_72 -.-> P_72
    P_88[">c…d>q…y>i2"]
    PgPolymorphic_88 -.-> P_88
    P_105[">c…d>q…y>i2>title"]
    PgClassExpression_105 -.-> P_105
    P_106[">c…d>q…y>i2>description"]
    PgClassExpression_106 -.-> P_106
    P_107[">c…d>q…y>i2>note"]
    PgClassExpression_107 -.-> P_107
    P_124[">c…d>q…y>i2>id x5"]
    PgClassExpression_124 -.-> P_124
    P_140[">c…d>q…y>i3"]
    PgPolymorphic_140 -.-> P_140
    P_157[">c…d>q…y>i3>title"]
    PgClassExpression_157 -.-> P_157
    P_158[">c…d>q…y>i3>description"]
    PgClassExpression_158 -.-> P_158
    P_159[">c…d>q…y>i3>note"]
    PgClassExpression_159 -.-> P_159
    P_176[">c…d>q…y>i3>id x5"]
    PgClassExpression_176 -.-> P_176

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_5,__TrackedObject_6 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Value_3,Constant_7,Constant_8,PgSelect_9,Constant_13,Constant_14,PgSelect_15,Constant_19,Constant_20,PgSelect_21,First_25,PgSelectSingle_26,PgClassExpression_27,InputStaticLeaf_28,PgSelect_29,First_33,PgSelectSingle_34,PgClassExpression_35,PgPolymorphic_36,First_50,PgClassExpression_72,InputStaticLeaf_80,PgSelect_81,First_85,PgSelectSingle_86,PgClassExpression_87,PgPolymorphic_88,First_102,PgClassExpression_124,InputStaticLeaf_132,PgSelect_133,First_137,PgSelectSingle_138,PgClassExpression_139,PgPolymorphic_140,First_154,PgClassExpression_176,Access_178,Access_179,Object_180,Map_184,List_185,Map_186,List_187,Map_188,List_189 bucket1
    classDef bucket2 stroke:#808000
    class PgSelectSingle_51,PgClassExpression_53,PgClassExpression_54,PgClassExpression_55 bucket2
    classDef bucket3 stroke:#3cb371
    class PgSelectSingle_103,PgClassExpression_105,PgClassExpression_106,PgClassExpression_107 bucket3
    classDef bucket4 stroke:#7f007f
    class PgSelectSingle_155,PgClassExpression_157,PgClassExpression_158,PgClassExpression_159 bucket4

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (group1[mutation])<br />~"):::bucket
    style Bucket1 stroke:#a52a2a
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (polymorphic_36[RelationalPost])<br />~>Mutation.createThreeRelationalPostsComputed>CreateRelationalPostPayload.query>Query.i1"):::bucket
    style Bucket2 stroke:#808000
    Bucket1 --> Bucket2
    Bucket3("Bucket 3 (polymorphic_88[RelationalPost])<br />~>Mutation.createThreeRelationalPostsComputed>CreateRelationalPostPayload.query>Query.i2"):::bucket
    style Bucket3 stroke:#3cb371
    Bucket1 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_140[RelationalPost])<br />~>Mutation.createThreeRelationalPostsComputed>CreateRelationalPostPayload.query>Query.i3"):::bucket
    style Bucket4 stroke:#7f007f
    Bucket1 --> Bucket4
    end
```
