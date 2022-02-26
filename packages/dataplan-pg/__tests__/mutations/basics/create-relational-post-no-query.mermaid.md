```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


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
    First_337["First[_337∈6@3]"]:::plan
    PgSelectSingle_338["PgSelectSingle[_338∈9@3]<br /><relational_posts>"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈9@3]<br /><__relation...__.”title”>"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈9@3]<br /><__relation...scription”>"]:::plan
    PgClassExpression_342["PgClassExpression[_342∈9@3]<br /><__relation...s__.”note”>"]:::plan
    PgClassExpression_359["PgClassExpression[_359∈6@3]<br /><__relation...ems__.”id”>"]:::plan
    Access_361["Access[_361∈0] {1,2,3}<br /><_3.pgSettings>"]:::plan
    Access_362["Access[_362∈0] {1,2,3}<br /><_3.withPgClient>"]:::plan
    Object_363["Object[_363∈0] {1,2,3}<br /><{pgSettings,withPgClient}>"]:::plan
    Map_367["Map[_367∈2@2]<br /><_45:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_368["List[_368∈2@2]<br /><_367>"]:::plan
    Map_369["Map[_369∈2@2]<br /><_97:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_370["List[_370∈2@2]<br /><_369>"]:::plan
    Map_371["Map[_371∈2@2]<br /><_149:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_372["List[_372∈2@2]<br /><_371>"]:::plan
    Map_373["Map[_373∈6@3]<br /><_217:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_374["List[_374∈6@3]<br /><_373>"]:::plan
    Map_375["Map[_375∈6@3]<br /><_269:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_376["List[_376∈6@3]<br /><_375>"]:::plan
    Map_377["Map[_377∈6@3]<br /><_321:{”0”:1,”1”:2,”2”:3,”3”:4}>"]:::plan
    List_378["List[_378∈6@3]<br /><_377>"]:::plan

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
    List_368 --> First_61
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
    List_370 --> First_113
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
    List_372 --> First_165
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
    List_374 --> First_233
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
    List_376 --> First_285
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
    List_378 --> First_337
    First_337 --> PgSelectSingle_338
    PgSelectSingle_338 --> PgClassExpression_340
    PgSelectSingle_338 --> PgClassExpression_341
    PgSelectSingle_338 --> PgClassExpression_342
    PgSelectSingle_321 --> PgClassExpression_359
    __Value_3 --> Access_361
    __Value_3 --> Access_362
    Access_361 --> Object_363
    Access_362 --> Object_363
    PgSelectSingle_45 --> Map_367
    Map_367 --> List_368
    PgSelectSingle_97 --> Map_369
    Map_369 --> List_370
    PgSelectSingle_149 --> Map_371
    Map_371 --> List_372
    PgSelectSingle_217 --> Map_373
    Map_373 --> List_374
    PgSelectSingle_269 --> Map_375
    Map_375 --> List_376
    PgSelectSingle_321 --> Map_377
    Map_377 --> List_378

    %% plan-to-path relationships
    P_5[">p2>query<br />>p3>query"]
    __Value_5 -.-> P_5
    P_6["~"]
    __TrackedObject_6 -.-> P_6
    P_22[">p1"]
    PgClassExpression_22 -.-> P_22
    P_38[">p2"]
    PgClassExpression_38 -.-> P_38
    P_47[">p2>q…y>i1"]
    PgPolymorphic_47 -.-> P_47
    P_64[">p2>q…y>i1>title"]
    PgClassExpression_64 -.-> P_64
    P_65[">p2>q…y>i1>description"]
    PgClassExpression_65 -.-> P_65
    P_66[">p2>q…y>i1>note"]
    PgClassExpression_66 -.-> P_66
    P_83[">p2>q…y>i1>id x5"]
    PgClassExpression_83 -.-> P_83
    P_99[">p2>q…y>i2"]
    PgPolymorphic_99 -.-> P_99
    P_116[">p2>q…y>i2>title"]
    PgClassExpression_116 -.-> P_116
    P_117[">p2>q…y>i2>description"]
    PgClassExpression_117 -.-> P_117
    P_118[">p2>q…y>i2>note"]
    PgClassExpression_118 -.-> P_118
    P_135[">p2>q…y>i2>id x5"]
    PgClassExpression_135 -.-> P_135
    P_151[">p2>q…y>i3"]
    PgPolymorphic_151 -.-> P_151
    P_168[">p2>q…y>i3>title"]
    PgClassExpression_168 -.-> P_168
    P_169[">p2>q…y>i3>description"]
    PgClassExpression_169 -.-> P_169
    P_170[">p2>q…y>i3>note"]
    PgClassExpression_170 -.-> P_170
    P_187[">p2>q…y>i3>id x5"]
    PgClassExpression_187 -.-> P_187
    P_210[">p3"]
    PgClassExpression_210 -.-> P_210
    P_219[">p3>q…y>i1"]
    PgPolymorphic_219 -.-> P_219
    P_236[">p3>q…y>i1>title"]
    PgClassExpression_236 -.-> P_236
    P_237[">p3>q…y>i1>description"]
    PgClassExpression_237 -.-> P_237
    P_238[">p3>q…y>i1>note"]
    PgClassExpression_238 -.-> P_238
    P_255[">p3>q…y>i1>id x5"]
    PgClassExpression_255 -.-> P_255
    P_271[">p3>q…y>i2"]
    PgPolymorphic_271 -.-> P_271
    P_288[">p3>q…y>i2>title"]
    PgClassExpression_288 -.-> P_288
    P_289[">p3>q…y>i2>description"]
    PgClassExpression_289 -.-> P_289
    P_290[">p3>q…y>i2>note"]
    PgClassExpression_290 -.-> P_290
    P_307[">p3>q…y>i2>id x5"]
    PgClassExpression_307 -.-> P_307
    P_323[">p3>q…y>i3"]
    PgPolymorphic_323 -.-> P_323
    P_340[">p3>q…y>i3>title"]
    PgClassExpression_340 -.-> P_340
    P_341[">p3>q…y>i3>description"]
    PgClassExpression_341 -.-> P_341
    P_342[">p3>q…y>i3>note"]
    PgClassExpression_342 -.-> P_342
    P_359[">p3>q…y>i3>id x5"]
    PgClassExpression_359 -.-> P_359

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,Access_361,Access_362,Object_363 bucket0
    classDef bucket1 stroke:#00bfff
    class InputStaticLeaf_8,InputStaticLeaf_9,InputStaticLeaf_10,Constant_11,Constant_12,PgInsert_13,PgClassExpression_17,PgInsert_18,PgClassExpression_22 bucket1
    classDef bucket2 stroke:#7f007f
    class InputStaticLeaf_24,InputStaticLeaf_25,InputStaticLeaf_26,Constant_27,Constant_28,PgInsert_29,PgClassExpression_33,PgInsert_34,PgClassExpression_38,InputStaticLeaf_39,PgSelect_40,First_44,PgSelectSingle_45,PgClassExpression_46,PgPolymorphic_47,First_61,PgClassExpression_83,InputStaticLeaf_91,PgSelect_92,First_96,PgSelectSingle_97,PgClassExpression_98,PgPolymorphic_99,First_113,PgClassExpression_135,InputStaticLeaf_143,PgSelect_144,First_148,PgSelectSingle_149,PgClassExpression_150,PgPolymorphic_151,First_165,PgClassExpression_187,Map_367,List_368,Map_369,List_370,Map_371,List_372 bucket2
    classDef bucket3 stroke:#ffa500
    class PgSelectSingle_62,PgClassExpression_64,PgClassExpression_65,PgClassExpression_66 bucket3
    classDef bucket4 stroke:#0000ff
    class PgSelectSingle_114,PgClassExpression_116,PgClassExpression_117,PgClassExpression_118 bucket4
    classDef bucket5 stroke:#7fff00
    class PgSelectSingle_166,PgClassExpression_168,PgClassExpression_169,PgClassExpression_170 bucket5
    classDef bucket6 stroke:#ff1493
    class InputStaticLeaf_196,InputStaticLeaf_197,InputStaticLeaf_198,Constant_199,Constant_200,PgInsert_201,PgClassExpression_205,PgInsert_206,PgClassExpression_210,InputStaticLeaf_211,PgSelect_212,First_216,PgSelectSingle_217,PgClassExpression_218,PgPolymorphic_219,First_233,PgClassExpression_255,InputStaticLeaf_263,PgSelect_264,First_268,PgSelectSingle_269,PgClassExpression_270,PgPolymorphic_271,First_285,PgClassExpression_307,InputStaticLeaf_315,PgSelect_316,First_320,PgSelectSingle_321,PgClassExpression_322,PgPolymorphic_323,First_337,PgClassExpression_359,Map_373,List_374,Map_375,List_376,Map_377,List_378 bucket6
    classDef bucket7 stroke:#808000
    class PgSelectSingle_234,PgClassExpression_236,PgClassExpression_237,PgClassExpression_238 bucket7
    classDef bucket8 stroke:#dda0dd
    class PgSelectSingle_286,PgClassExpression_288,PgClassExpression_289,PgClassExpression_290 bucket8
    classDef bucket9 stroke:#ff0000
    class PgSelectSingle_338,PgClassExpression_340,PgClassExpression_341,PgClassExpression_342 bucket9

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT <-O- _6"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (group1[mutation])<br />~>Mutation.p1<br />⠀ROOT <-O- _22"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (group2[mutation])<br />~>Mutation.p2<br />⠀ROOT <-O- _38<br />⠀⠀query <-O- _5<br />⠀⠀⠀query.i1 <-O- _47<br />⠀⠀⠀⠀query.i1.id <-L- _83<br />⠀⠀⠀query.i2 <-O- _99<br />⠀⠀⠀⠀query.i2.id <-L- _135<br />⠀⠀⠀query.i3 <-O- _151<br />⠀⠀⠀⠀query.i3.id <-L- _187"):::bucket
    style Bucket2 stroke:#7f007f
    Bucket0 --> Bucket2
    Bucket3("Bucket 3 (polymorphic_47[RelationalPost])<br />~>Mutation.p2>CreateRelationalPostPayload.query>Query.i1<br />⠀⠀title <-L- _64<br />⠀⠀description <-L- _65<br />⠀⠀note <-L- _66"):::bucket
    style Bucket3 stroke:#ffa500
    Bucket2 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_99[RelationalPost])<br />~>Mutation.p2>CreateRelationalPostPayload.query>Query.i2<br />⠀⠀title <-L- _116<br />⠀⠀description <-L- _117<br />⠀⠀note <-L- _118"):::bucket
    style Bucket4 stroke:#0000ff
    Bucket2 --> Bucket4
    Bucket5("Bucket 5 (polymorphic_151[RelationalPost])<br />~>Mutation.p2>CreateRelationalPostPayload.query>Query.i3<br />⠀⠀title <-L- _168<br />⠀⠀description <-L- _169<br />⠀⠀note <-L- _170"):::bucket
    style Bucket5 stroke:#7fff00
    Bucket2 --> Bucket5
    Bucket6("Bucket 6 (group3[mutation])<br />~>Mutation.p3<br />⠀ROOT <-O- _210<br />⠀⠀query <-O- _5<br />⠀⠀⠀query.i1 <-O- _219<br />⠀⠀⠀⠀query.i1.id <-L- _255<br />⠀⠀⠀query.i2 <-O- _271<br />⠀⠀⠀⠀query.i2.id <-L- _307<br />⠀⠀⠀query.i3 <-O- _323<br />⠀⠀⠀⠀query.i3.id <-L- _359"):::bucket
    style Bucket6 stroke:#ff1493
    Bucket0 --> Bucket6
    Bucket7("Bucket 7 (polymorphic_219[RelationalPost])<br />~>Mutation.p3>CreateRelationalPostPayload.query>Query.i1<br />⠀⠀title <-L- _236<br />⠀⠀description <-L- _237<br />⠀⠀note <-L- _238"):::bucket
    style Bucket7 stroke:#808000
    Bucket6 --> Bucket7
    Bucket8("Bucket 8 (polymorphic_271[RelationalPost])<br />~>Mutation.p3>CreateRelationalPostPayload.query>Query.i2<br />⠀⠀title <-L- _288<br />⠀⠀description <-L- _289<br />⠀⠀note <-L- _290"):::bucket
    style Bucket8 stroke:#dda0dd
    Bucket6 --> Bucket8
    Bucket9("Bucket 9 (polymorphic_323[RelationalPost])<br />~>Mutation.p3>CreateRelationalPostPayload.query>Query.i3<br />⠀⠀title <-L- _340<br />⠀⠀description <-L- _341<br />⠀⠀note <-L- _342"):::bucket
    style Bucket9 stroke:#ff0000
    Bucket6 --> Bucket9
    end
```
