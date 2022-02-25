```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px


    %% define plans
    __Value_3["__Value[_3∈0] {1,2,3}<br /><context>"]:::plan
    __Value_5["__Value[_5∈0]<br /><rootValue>"]:::plan
    __TrackedObject_6["__TrackedObject[_6∈0]"]:::plan
    InputStaticLeaf_8["InputStaticLeaf[_8∈1@1]"]:::plan
    InputStaticLeaf_9["InputStaticLeaf[_9∈1@1]"]:::plan
    InputStaticLeaf_10["InputStaticLeaf[_10∈1@1]"]:::plan
    Constant_11["Constant[_11∈1@1]"]:::plan
    Constant_12["Constant[_12∈1@1]"]:::plan
    PgInsert_13[["PgInsert[_13∈1@1]"]]:::sideeffectplan
    PgClassExpression_17["PgClassExpression[_17∈1@1]<br /><__relation...ems__.”id”>"]:::plan
    PgInsert_18[["PgInsert[_18∈1@1]"]]:::sideeffectplan
    PgClassExpression_22["PgClassExpression[_22∈1@1]<br /><__relational_posts__>"]:::plan
    InputStaticLeaf_24["InputStaticLeaf[_24∈2@2]"]:::plan
    InputStaticLeaf_25["InputStaticLeaf[_25∈2@2]"]:::plan
    InputStaticLeaf_26["InputStaticLeaf[_26∈2@2]"]:::plan
    Constant_27["Constant[_27∈2@2]"]:::plan
    Constant_28["Constant[_28∈2@2]"]:::plan
    PgInsert_29[["PgInsert[_29∈2@2]"]]:::sideeffectplan
    PgClassExpression_33["PgClassExpression[_33∈2@2]<br /><__relation...ems__.”id”>"]:::plan
    PgInsert_34[["PgInsert[_34∈2@2]"]]:::sideeffectplan
    PgClassExpression_38["PgClassExpression[_38∈2@2]<br /><__relational_posts__>"]:::plan
    InputStaticLeaf_39["InputStaticLeaf[_39∈2@2]"]:::plan
    PgSelect_40[["PgSelect[_40∈2@2]<br /><relational_items>"]]:::plan
    First_44["First[_44∈2@2]"]:::plan
    PgSelectSingle_45["PgSelectSingle[_45∈2@2]<br /><relational_items>"]:::plan
    PgClassExpression_46["PgClassExpression[_46∈2@2]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_47["PgPolymorphic[_47∈2@2]"]:::plan
    PgSelect_57[["PgSelect[_57∈2@2]<br /><relational_posts>"]]:::plan
    First_61["First[_61∈2@2]"]:::plan
    PgSelectSingle_62["PgSelectSingle[_62∈3@2]<br /><relational_posts>"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈3@2]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_65["PgClassExpression[_65∈3@2]<br /><__relation...scription”>"]:::plan
    PgClassExpression_66["PgClassExpression[_66∈3@2]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_83["PgClassExpression[_83∈2@2]<br /><__relation...ems__.”id”>"]:::plan
    InputStaticLeaf_91["InputStaticLeaf[_91∈2@2]"]:::plan
    PgSelect_92[["PgSelect[_92∈2@2]<br /><relational_items>"]]:::plan
    First_96["First[_96∈2@2]"]:::plan
    PgSelectSingle_97["PgSelectSingle[_97∈2@2]<br /><relational_items>"]:::plan
    PgClassExpression_98["PgClassExpression[_98∈2@2]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_99["PgPolymorphic[_99∈2@2]"]:::plan
    PgSelect_109[["PgSelect[_109∈2@2]<br /><relational_posts>"]]:::plan
    First_113["First[_113∈2@2]"]:::plan
    PgSelectSingle_114["PgSelectSingle[_114∈4@2]<br /><relational_posts>"]:::plan
    PgClassExpression_116["PgClassExpression[_116∈4@2]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_117["PgClassExpression[_117∈4@2]<br /><__relation...scription”>"]:::plan
    PgClassExpression_118["PgClassExpression[_118∈4@2]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_135["PgClassExpression[_135∈2@2]<br /><__relation...ems__.”id”>"]:::plan
    InputStaticLeaf_143["InputStaticLeaf[_143∈2@2]"]:::plan
    PgSelect_144[["PgSelect[_144∈2@2]<br /><relational_items>"]]:::plan
    First_148["First[_148∈2@2]"]:::plan
    PgSelectSingle_149["PgSelectSingle[_149∈2@2]<br /><relational_items>"]:::plan
    PgClassExpression_150["PgClassExpression[_150∈2@2]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_151["PgPolymorphic[_151∈2@2]"]:::plan
    PgSelect_161[["PgSelect[_161∈2@2]<br /><relational_posts>"]]:::plan
    First_165["First[_165∈2@2]"]:::plan
    PgSelectSingle_166["PgSelectSingle[_166∈5@2]<br /><relational_posts>"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈5@2]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_169["PgClassExpression[_169∈5@2]<br /><__relation...scription”>"]:::plan
    PgClassExpression_170["PgClassExpression[_170∈5@2]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_187["PgClassExpression[_187∈2@2]<br /><__relation...ems__.”id”>"]:::plan
    InputStaticLeaf_196["InputStaticLeaf[_196∈6@3]"]:::plan
    InputStaticLeaf_197["InputStaticLeaf[_197∈6@3]"]:::plan
    InputStaticLeaf_198["InputStaticLeaf[_198∈6@3]"]:::plan
    Constant_199["Constant[_199∈6@3]"]:::plan
    Constant_200["Constant[_200∈6@3]"]:::plan
    PgInsert_201[["PgInsert[_201∈6@3]"]]:::sideeffectplan
    PgClassExpression_205["PgClassExpression[_205∈6@3]<br /><__relation...ems__.”id”>"]:::plan
    PgInsert_206[["PgInsert[_206∈6@3]"]]:::sideeffectplan
    PgClassExpression_210["PgClassExpression[_210∈6@3]<br /><__relational_posts__>"]:::plan
    InputStaticLeaf_211["InputStaticLeaf[_211∈6@3]"]:::plan
    PgSelect_212[["PgSelect[_212∈6@3]<br /><relational_items>"]]:::plan
    First_216["First[_216∈6@3]"]:::plan
    PgSelectSingle_217["PgSelectSingle[_217∈6@3]<br /><relational_items>"]:::plan
    PgClassExpression_218["PgClassExpression[_218∈6@3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_219["PgPolymorphic[_219∈6@3]"]:::plan
    PgSelect_229[["PgSelect[_229∈6@3]<br /><relational_posts>"]]:::plan
    First_233["First[_233∈6@3]"]:::plan
    PgSelectSingle_234["PgSelectSingle[_234∈7@3]<br /><relational_posts>"]:::plan
    PgClassExpression_236["PgClassExpression[_236∈7@3]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_237["PgClassExpression[_237∈7@3]<br /><__relation...scription”>"]:::plan
    PgClassExpression_238["PgClassExpression[_238∈7@3]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_255["PgClassExpression[_255∈6@3]<br /><__relation...ems__.”id”>"]:::plan
    InputStaticLeaf_263["InputStaticLeaf[_263∈6@3]"]:::plan
    PgSelect_264[["PgSelect[_264∈6@3]<br /><relational_items>"]]:::plan
    First_268["First[_268∈6@3]"]:::plan
    PgSelectSingle_269["PgSelectSingle[_269∈6@3]<br /><relational_items>"]:::plan
    PgClassExpression_270["PgClassExpression[_270∈6@3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_271["PgPolymorphic[_271∈6@3]"]:::plan
    PgSelect_281[["PgSelect[_281∈6@3]<br /><relational_posts>"]]:::plan
    First_285["First[_285∈6@3]"]:::plan
    PgSelectSingle_286["PgSelectSingle[_286∈8@3]<br /><relational_posts>"]:::plan
    PgClassExpression_288["PgClassExpression[_288∈8@3]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_289["PgClassExpression[_289∈8@3]<br /><__relation...scription”>"]:::plan
    PgClassExpression_290["PgClassExpression[_290∈8@3]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_307["PgClassExpression[_307∈6@3]<br /><__relation...ems__.”id”>"]:::plan
    InputStaticLeaf_315["InputStaticLeaf[_315∈6@3]"]:::plan
    PgSelect_316[["PgSelect[_316∈6@3]<br /><relational_items>"]]:::plan
    First_320["First[_320∈6@3]"]:::plan
    PgSelectSingle_321["PgSelectSingle[_321∈6@3]<br /><relational_items>"]:::plan
    PgClassExpression_322["PgClassExpression[_322∈6@3]<br /><__relation...s__.”type”>"]:::plan
    PgPolymorphic_323["PgPolymorphic[_323∈6@3]"]:::plan
    PgSelect_333[["PgSelect[_333∈6@3]<br /><relational_posts>"]]:::plan
    First_337["First[_337∈6@3]"]:::plan
    PgSelectSingle_338["PgSelectSingle[_338∈9@3]<br /><relational_posts>"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈9@3]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈9@3]<br /><__relation...scription”>"]:::plan
    PgClassExpression_342["PgClassExpression[_342∈9@3]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_359["PgClassExpression[_359∈6@3]<br /><__relation...ems__.”id”>"]:::plan
    Access_361["Access[_361∈0] {1,2,3}<br /><_3.pgSettings>"]:::plan
    Access_362["Access[_362∈0] {1,2,3}<br /><_3.withPgClient>"]:::plan
    Object_363["Object[_363∈0] {1,2,3}<br /><{pgSettings,withPgClient}>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_363 --> PgInsert_13
    Constant_11 --> PgInsert_13
    Constant_12 --> PgInsert_13
    PgInsert_13 --> PgClassExpression_17
    Object_363 --> PgInsert_18
    PgClassExpression_17 --> PgInsert_18
    InputStaticLeaf_8 --> PgInsert_18
    InputStaticLeaf_9 --> PgInsert_18
    InputStaticLeaf_10 --> PgInsert_18
    PgInsert_18 --> PgClassExpression_22
    Object_363 --> PgInsert_29
    Constant_27 --> PgInsert_29
    Constant_28 --> PgInsert_29
    PgInsert_29 --> PgClassExpression_33
    Object_363 --> PgInsert_34
    PgClassExpression_33 --> PgInsert_34
    InputStaticLeaf_24 --> PgInsert_34
    InputStaticLeaf_25 --> PgInsert_34
    InputStaticLeaf_26 --> PgInsert_34
    PgInsert_34 --> PgClassExpression_38
    Object_363 --> PgSelect_40
    InputStaticLeaf_39 --> PgSelect_40
    PgSelect_40 --> First_44
    First_44 --> PgSelectSingle_45
    PgSelectSingle_45 --> PgClassExpression_46
    PgSelectSingle_45 --> PgPolymorphic_47
    PgClassExpression_46 --> PgPolymorphic_47
    Object_363 --> PgSelect_57
    PgClassExpression_83 --> PgSelect_57
    PgSelect_57 --> First_61
    First_61 --> PgSelectSingle_62
    PgSelectSingle_62 --> PgClassExpression_64
    PgSelectSingle_62 --> PgClassExpression_65
    PgSelectSingle_62 --> PgClassExpression_66
    PgSelectSingle_45 --> PgClassExpression_83
    Object_363 --> PgSelect_92
    InputStaticLeaf_91 --> PgSelect_92
    PgSelect_92 --> First_96
    First_96 --> PgSelectSingle_97
    PgSelectSingle_97 --> PgClassExpression_98
    PgSelectSingle_97 --> PgPolymorphic_99
    PgClassExpression_98 --> PgPolymorphic_99
    Object_363 --> PgSelect_109
    PgClassExpression_135 --> PgSelect_109
    PgSelect_109 --> First_113
    First_113 --> PgSelectSingle_114
    PgSelectSingle_114 --> PgClassExpression_116
    PgSelectSingle_114 --> PgClassExpression_117
    PgSelectSingle_114 --> PgClassExpression_118
    PgSelectSingle_97 --> PgClassExpression_135
    Object_363 --> PgSelect_144
    InputStaticLeaf_143 --> PgSelect_144
    PgSelect_144 --> First_148
    First_148 --> PgSelectSingle_149
    PgSelectSingle_149 --> PgClassExpression_150
    PgSelectSingle_149 --> PgPolymorphic_151
    PgClassExpression_150 --> PgPolymorphic_151
    Object_363 --> PgSelect_161
    PgClassExpression_187 --> PgSelect_161
    PgSelect_161 --> First_165
    First_165 --> PgSelectSingle_166
    PgSelectSingle_166 --> PgClassExpression_168
    PgSelectSingle_166 --> PgClassExpression_169
    PgSelectSingle_166 --> PgClassExpression_170
    PgSelectSingle_149 --> PgClassExpression_187
    Object_363 --> PgInsert_201
    Constant_199 --> PgInsert_201
    Constant_200 --> PgInsert_201
    PgInsert_201 --> PgClassExpression_205
    Object_363 --> PgInsert_206
    PgClassExpression_205 --> PgInsert_206
    InputStaticLeaf_196 --> PgInsert_206
    InputStaticLeaf_197 --> PgInsert_206
    InputStaticLeaf_198 --> PgInsert_206
    PgInsert_206 --> PgClassExpression_210
    Object_363 --> PgSelect_212
    InputStaticLeaf_211 --> PgSelect_212
    PgSelect_212 --> First_216
    First_216 --> PgSelectSingle_217
    PgSelectSingle_217 --> PgClassExpression_218
    PgSelectSingle_217 --> PgPolymorphic_219
    PgClassExpression_218 --> PgPolymorphic_219
    Object_363 --> PgSelect_229
    PgClassExpression_255 --> PgSelect_229
    PgSelect_229 --> First_233
    First_233 --> PgSelectSingle_234
    PgSelectSingle_234 --> PgClassExpression_236
    PgSelectSingle_234 --> PgClassExpression_237
    PgSelectSingle_234 --> PgClassExpression_238
    PgSelectSingle_217 --> PgClassExpression_255
    Object_363 --> PgSelect_264
    InputStaticLeaf_263 --> PgSelect_264
    PgSelect_264 --> First_268
    First_268 --> PgSelectSingle_269
    PgSelectSingle_269 --> PgClassExpression_270
    PgSelectSingle_269 --> PgPolymorphic_271
    PgClassExpression_270 --> PgPolymorphic_271
    Object_363 --> PgSelect_281
    PgClassExpression_307 --> PgSelect_281
    PgSelect_281 --> First_285
    First_285 --> PgSelectSingle_286
    PgSelectSingle_286 --> PgClassExpression_288
    PgSelectSingle_286 --> PgClassExpression_289
    PgSelectSingle_286 --> PgClassExpression_290
    PgSelectSingle_269 --> PgClassExpression_307
    Object_363 --> PgSelect_316
    InputStaticLeaf_315 --> PgSelect_316
    PgSelect_316 --> First_320
    First_320 --> PgSelectSingle_321
    PgSelectSingle_321 --> PgClassExpression_322
    PgSelectSingle_321 --> PgPolymorphic_323
    PgClassExpression_322 --> PgPolymorphic_323
    Object_363 --> PgSelect_333
    PgClassExpression_359 --> PgSelect_333
    PgSelect_333 --> First_337
    First_337 --> PgSelectSingle_338
    PgSelectSingle_338 --> PgClassExpression_340
    PgSelectSingle_338 --> PgClassExpression_341
    PgSelectSingle_338 --> PgClassExpression_342
    PgSelectSingle_321 --> PgClassExpression_359
    __Value_3 --> Access_361
    __Value_3 --> Access_362
    Access_361 --> Object_363
    Access_362 --> Object_363

    %% plan-to-path relationships
    P1["~"]
    __TrackedObject_6 -.-> P1
    P2[">p1"]
    PgClassExpression_22 -.-> P2
    P3[">p2"]
    PgClassExpression_38 -.-> P3
    P4[">p2>query<br />>p3>query"]
    __Value_5 -.-> P4
    P5[">p2>q…y>i1"]
    PgPolymorphic_47 -.-> P5
    P6[">p2>q…y>i1>id x5"]
    PgClassExpression_83 -.-> P6
    P7[">p2>q…y>i1>title"]
    PgClassExpression_64 -.-> P7
    P8[">p2>q…y>i1>description"]
    PgClassExpression_65 -.-> P8
    P9[">p2>q…y>i1>note"]
    PgClassExpression_66 -.-> P9
    P10[">p2>q…y>i2"]
    PgPolymorphic_99 -.-> P10
    P11[">p2>q…y>i2>id x5"]
    PgClassExpression_135 -.-> P11
    P12[">p2>q…y>i2>title"]
    PgClassExpression_116 -.-> P12
    P13[">p2>q…y>i2>description"]
    PgClassExpression_117 -.-> P13
    P14[">p2>q…y>i2>note"]
    PgClassExpression_118 -.-> P14
    P15[">p2>q…y>i3"]
    PgPolymorphic_151 -.-> P15
    P16[">p2>q…y>i3>id x5"]
    PgClassExpression_187 -.-> P16
    P17[">p2>q…y>i3>title"]
    PgClassExpression_168 -.-> P17
    P18[">p2>q…y>i3>description"]
    PgClassExpression_169 -.-> P18
    P19[">p2>q…y>i3>note"]
    PgClassExpression_170 -.-> P19
    P20[">p3"]
    PgClassExpression_210 -.-> P20
    P21[">p3>q…y>i1"]
    PgPolymorphic_219 -.-> P21
    P22[">p3>q…y>i1>id x5"]
    PgClassExpression_255 -.-> P22
    P23[">p3>q…y>i1>title"]
    PgClassExpression_236 -.-> P23
    P24[">p3>q…y>i1>description"]
    PgClassExpression_237 -.-> P24
    P25[">p3>q…y>i1>note"]
    PgClassExpression_238 -.-> P25
    P26[">p3>q…y>i2"]
    PgPolymorphic_271 -.-> P26
    P27[">p3>q…y>i2>id x5"]
    PgClassExpression_307 -.-> P27
    P28[">p3>q…y>i2>title"]
    PgClassExpression_288 -.-> P28
    P29[">p3>q…y>i2>description"]
    PgClassExpression_289 -.-> P29
    P30[">p3>q…y>i2>note"]
    PgClassExpression_290 -.-> P30
    P31[">p3>q…y>i3"]
    PgPolymorphic_323 -.-> P31
    P32[">p3>q…y>i3>id x5"]
    PgClassExpression_359 -.-> P32
    P33[">p3>q…y>i3>title"]
    PgClassExpression_340 -.-> P33
    P34[">p3>q…y>i3>description"]
    PgClassExpression_341 -.-> P34
    P35[">p3>q…y>i3>note"]
    PgClassExpression_342 -.-> P35

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,Access_361,Access_362,Object_363 bucket0
    classDef bucket1 stroke:#a52a2a
    class InputStaticLeaf_8,InputStaticLeaf_9,InputStaticLeaf_10,Constant_11,Constant_12,PgInsert_13,PgClassExpression_17,PgInsert_18,PgClassExpression_22 bucket1
    classDef bucket2 stroke:#808000
    class InputStaticLeaf_24,InputStaticLeaf_25,InputStaticLeaf_26,Constant_27,Constant_28,PgInsert_29,PgClassExpression_33,PgInsert_34,PgClassExpression_38,InputStaticLeaf_39,PgSelect_40,First_44,PgSelectSingle_45,PgClassExpression_46,PgPolymorphic_47,PgSelect_57,First_61,PgClassExpression_83,InputStaticLeaf_91,PgSelect_92,First_96,PgSelectSingle_97,PgClassExpression_98,PgPolymorphic_99,PgSelect_109,First_113,PgClassExpression_135,InputStaticLeaf_143,PgSelect_144,First_148,PgSelectSingle_149,PgClassExpression_150,PgPolymorphic_151,PgSelect_161,First_165,PgClassExpression_187 bucket2
    classDef bucket3 stroke:#3cb371
    class PgSelectSingle_62,PgClassExpression_64,PgClassExpression_65,PgClassExpression_66 bucket3
    classDef bucket4 stroke:#7f007f
    class PgSelectSingle_114,PgClassExpression_116,PgClassExpression_117,PgClassExpression_118 bucket4
    classDef bucket5 stroke:#ff0000
    class PgSelectSingle_166,PgClassExpression_168,PgClassExpression_169,PgClassExpression_170 bucket5
    classDef bucket6 stroke:#ffa500
    class InputStaticLeaf_196,InputStaticLeaf_197,InputStaticLeaf_198,Constant_199,Constant_200,PgInsert_201,PgClassExpression_205,PgInsert_206,PgClassExpression_210,InputStaticLeaf_211,PgSelect_212,First_216,PgSelectSingle_217,PgClassExpression_218,PgPolymorphic_219,PgSelect_229,First_233,PgClassExpression_255,InputStaticLeaf_263,PgSelect_264,First_268,PgSelectSingle_269,PgClassExpression_270,PgPolymorphic_271,PgSelect_281,First_285,PgClassExpression_307,InputStaticLeaf_315,PgSelect_316,First_320,PgSelectSingle_321,PgClassExpression_322,PgPolymorphic_323,PgSelect_333,First_337,PgClassExpression_359 bucket6
    classDef bucket7 stroke:#ffff00
    class PgSelectSingle_234,PgClassExpression_236,PgClassExpression_237,PgClassExpression_238 bucket7
    classDef bucket8 stroke:#7fff00
    class PgSelectSingle_286,PgClassExpression_288,PgClassExpression_289,PgClassExpression_290 bucket8
    classDef bucket9 stroke:#4169e1
    class PgSelectSingle_338,PgClassExpression_340,PgClassExpression_341,PgClassExpression_342 bucket9

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (group1[mutation])<br />~"):::bucket
    style Bucket1 stroke:#a52a2a
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (group2[mutation])<br />~"):::bucket
    style Bucket2 stroke:#808000
    Bucket0 --> Bucket2
    Bucket3("Bucket 3 (polymorphic_47[RelationalPost])<br />>p2>query>i1"):::bucket
    style Bucket3 stroke:#3cb371
    Bucket2 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_99[RelationalPost])<br />>p2>query>i2"):::bucket
    style Bucket4 stroke:#7f007f
    Bucket2 --> Bucket4
    Bucket5("Bucket 5 (polymorphic_151[RelationalPost])<br />>p2>query>i3"):::bucket
    style Bucket5 stroke:#ff0000
    Bucket2 --> Bucket5
    Bucket6("Bucket 6 (group3[mutation])<br />~"):::bucket
    style Bucket6 stroke:#ffa500
    Bucket0 --> Bucket6
    Bucket7("Bucket 7 (polymorphic_219[RelationalPost])<br />>p3>query>i1"):::bucket
    style Bucket7 stroke:#ffff00
    Bucket6 --> Bucket7
    Bucket8("Bucket 8 (polymorphic_271[RelationalPost])<br />>p3>query>i2"):::bucket
    style Bucket8 stroke:#7fff00
    Bucket6 --> Bucket8
    Bucket9("Bucket 9 (polymorphic_323[RelationalPost])<br />>p3>query>i3"):::bucket
    style Bucket9 stroke:#4169e1
    Bucket6 --> Bucket9
    end
```
