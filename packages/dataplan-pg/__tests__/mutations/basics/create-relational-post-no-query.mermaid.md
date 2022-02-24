```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px

    %% subgraph fields
    P1{{"~"}}:::path
    P2{{">p1"}}:::path
    %% P1 -.-> P2
    P3{{">p2"}}:::path
    P4{{">p2>query"}}:::path
    P5{{">p2>query>i1"}}:::path
    P6([">p2>query>i1>id"]):::path
    %% P5 -.-> P6
    P7([">p2>query>i1>id"]):::path
    %% P5 -.-> P7
    P8([">p2>query>i1>title"]):::path
    %% P5 -.-> P8
    P9([">p2>query>i1>description"]):::path
    %% P5 -.-> P9
    P10([">p2>query>i1>note"]):::path
    %% P5 -.-> P10
    P11([">p2>query>i1>id"]):::path
    %% P5 -.-> P11
    P12([">p2>query>i1>id"]):::path
    %% P5 -.-> P12
    P13([">p2>query>i1>id"]):::path
    %% P5 -.-> P13
    %% P4 -.-> P5
    P14{{">p2>query>i2"}}:::path
    P15([">p2>query>i2>id"]):::path
    %% P14 -.-> P15
    P16([">p2>query>i2>id"]):::path
    %% P14 -.-> P16
    P17([">p2>query>i2>title"]):::path
    %% P14 -.-> P17
    P18([">p2>query>i2>description"]):::path
    %% P14 -.-> P18
    P19([">p2>query>i2>note"]):::path
    %% P14 -.-> P19
    P20([">p2>query>i2>id"]):::path
    %% P14 -.-> P20
    P21([">p2>query>i2>id"]):::path
    %% P14 -.-> P21
    P22([">p2>query>i2>id"]):::path
    %% P14 -.-> P22
    %% P4 -.-> P14
    P23{{">p2>query>i3"}}:::path
    P24([">p2>query>i3>id"]):::path
    %% P23 -.-> P24
    P25([">p2>query>i3>id"]):::path
    %% P23 -.-> P25
    P26([">p2>query>i3>title"]):::path
    %% P23 -.-> P26
    P27([">p2>query>i3>description"]):::path
    %% P23 -.-> P27
    P28([">p2>query>i3>note"]):::path
    %% P23 -.-> P28
    P29([">p2>query>i3>id"]):::path
    %% P23 -.-> P29
    P30([">p2>query>i3>id"]):::path
    %% P23 -.-> P30
    P31([">p2>query>i3>id"]):::path
    %% P23 -.-> P31
    %% P4 -.-> P23
    %% P3 -.-> P4
    %% P1 -.-> P3
    P32{{">p3"}}:::path
    P33{{">p3>query"}}:::path
    P34{{">p3>query>i1"}}:::path
    P35([">p3>query>i1>id"]):::path
    %% P34 -.-> P35
    P36([">p3>query>i1>id"]):::path
    %% P34 -.-> P36
    P37([">p3>query>i1>title"]):::path
    %% P34 -.-> P37
    P38([">p3>query>i1>description"]):::path
    %% P34 -.-> P38
    P39([">p3>query>i1>note"]):::path
    %% P34 -.-> P39
    P40([">p3>query>i1>id"]):::path
    %% P34 -.-> P40
    P41([">p3>query>i1>id"]):::path
    %% P34 -.-> P41
    P42([">p3>query>i1>id"]):::path
    %% P34 -.-> P42
    %% P33 -.-> P34
    P43{{">p3>query>i2"}}:::path
    P44([">p3>query>i2>id"]):::path
    %% P43 -.-> P44
    P45([">p3>query>i2>id"]):::path
    %% P43 -.-> P45
    P46([">p3>query>i2>title"]):::path
    %% P43 -.-> P46
    P47([">p3>query>i2>description"]):::path
    %% P43 -.-> P47
    P48([">p3>query>i2>note"]):::path
    %% P43 -.-> P48
    P49([">p3>query>i2>id"]):::path
    %% P43 -.-> P49
    P50([">p3>query>i2>id"]):::path
    %% P43 -.-> P50
    P51([">p3>query>i2>id"]):::path
    %% P43 -.-> P51
    %% P33 -.-> P43
    P52{{">p3>query>i3"}}:::path
    P53([">p3>query>i3>id"]):::path
    %% P52 -.-> P53
    P54([">p3>query>i3>id"]):::path
    %% P52 -.-> P54
    P55([">p3>query>i3>title"]):::path
    %% P52 -.-> P55
    P56([">p3>query>i3>description"]):::path
    %% P52 -.-> P56
    P57([">p3>query>i3>note"]):::path
    %% P52 -.-> P57
    P58([">p3>query>i3>id"]):::path
    %% P52 -.-> P58
    P59([">p3>query>i3>id"]):::path
    %% P52 -.-> P59
    P60([">p3>query>i3>id"]):::path
    %% P52 -.-> P60
    %% P33 -.-> P52
    %% P32 -.-> P33
    %% P1 -.-> P32
    %% end

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
    PgClassExpression_17["PgClassExpression[_17∈1@1]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    PgInsert_18[["PgInsert[_18∈1@1]"]]:::sideeffectplan
    PgClassExpression_22["PgClassExpression[_22∈1@1]<br /><__relational_posts__>"]:::plan
    InputStaticLeaf_24["InputStaticLeaf[_24∈2@2]"]:::plan
    InputStaticLeaf_25["InputStaticLeaf[_25∈2@2]"]:::plan
    InputStaticLeaf_26["InputStaticLeaf[_26∈2@2]"]:::plan
    Constant_27["Constant[_27∈2@2]"]:::plan
    Constant_28["Constant[_28∈2@2]"]:::plan
    PgInsert_29[["PgInsert[_29∈2@2]"]]:::sideeffectplan
    PgClassExpression_33["PgClassExpression[_33∈2@2]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    PgInsert_34[["PgInsert[_34∈2@2]"]]:::sideeffectplan
    PgClassExpression_38["PgClassExpression[_38∈2@2]<br /><__relational_posts__>"]:::plan
    InputStaticLeaf_39["InputStaticLeaf[_39∈2@2]"]:::plan
    PgSelect_40[["PgSelect[_40∈2@2]<br /><relational_items>"]]:::plan
    First_44["First[_44∈2@2]"]:::plan
    PgSelectSingle_45["PgSelectSingle[_45∈2@2]<br /><relational_items>"]:::plan
    PgClassExpression_46["PgClassExpression[_46∈2@2]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_47["PgPolymorphic[_47∈2@2]"]:::plan
    First_61["First[_61∈2@2]"]:::plan
    PgSelectSingle_62["PgSelectSingle[_62∈2@2]<br /><relational_posts>"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈2@2]<br /><__relation...__.#quot;title#quot;>"]:::plan
    PgClassExpression_65["PgClassExpression[_65∈2@2]<br /><__relation...scription#quot;>"]:::plan
    PgClassExpression_66["PgClassExpression[_66∈2@2]<br /><__relation...s__.#quot;note#quot;>"]:::plan
    PgClassExpression_83["PgClassExpression[_83∈2@2]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    InputStaticLeaf_91["InputStaticLeaf[_91∈2@2]"]:::plan
    PgSelect_92[["PgSelect[_92∈2@2]<br /><relational_items>"]]:::plan
    First_96["First[_96∈2@2]"]:::plan
    PgSelectSingle_97["PgSelectSingle[_97∈2@2]<br /><relational_items>"]:::plan
    PgClassExpression_98["PgClassExpression[_98∈2@2]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_99["PgPolymorphic[_99∈2@2]"]:::plan
    First_113["First[_113∈2@2]"]:::plan
    PgSelectSingle_114["PgSelectSingle[_114∈2@2]<br /><relational_posts>"]:::plan
    PgClassExpression_116["PgClassExpression[_116∈2@2]<br /><__relation...__.#quot;title#quot;>"]:::plan
    PgClassExpression_117["PgClassExpression[_117∈2@2]<br /><__relation...scription#quot;>"]:::plan
    PgClassExpression_118["PgClassExpression[_118∈2@2]<br /><__relation...s__.#quot;note#quot;>"]:::plan
    PgClassExpression_135["PgClassExpression[_135∈2@2]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    InputStaticLeaf_143["InputStaticLeaf[_143∈2@2]"]:::plan
    PgSelect_144[["PgSelect[_144∈2@2]<br /><relational_items>"]]:::plan
    First_148["First[_148∈2@2]"]:::plan
    PgSelectSingle_149["PgSelectSingle[_149∈2@2]<br /><relational_items>"]:::plan
    PgClassExpression_150["PgClassExpression[_150∈2@2]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_151["PgPolymorphic[_151∈2@2]"]:::plan
    First_165["First[_165∈2@2]"]:::plan
    PgSelectSingle_166["PgSelectSingle[_166∈2@2]<br /><relational_posts>"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈2@2]<br /><__relation...__.#quot;title#quot;>"]:::plan
    PgClassExpression_169["PgClassExpression[_169∈2@2]<br /><__relation...scription#quot;>"]:::plan
    PgClassExpression_170["PgClassExpression[_170∈2@2]<br /><__relation...s__.#quot;note#quot;>"]:::plan
    PgClassExpression_187["PgClassExpression[_187∈2@2]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    InputStaticLeaf_196["InputStaticLeaf[_196∈3@3]"]:::plan
    InputStaticLeaf_197["InputStaticLeaf[_197∈3@3]"]:::plan
    InputStaticLeaf_198["InputStaticLeaf[_198∈3@3]"]:::plan
    Constant_199["Constant[_199∈3@3]"]:::plan
    Constant_200["Constant[_200∈3@3]"]:::plan
    PgInsert_201[["PgInsert[_201∈3@3]"]]:::sideeffectplan
    PgClassExpression_205["PgClassExpression[_205∈3@3]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    PgInsert_206[["PgInsert[_206∈3@3]"]]:::sideeffectplan
    PgClassExpression_210["PgClassExpression[_210∈3@3]<br /><__relational_posts__>"]:::plan
    InputStaticLeaf_211["InputStaticLeaf[_211∈3@3]"]:::plan
    PgSelect_212[["PgSelect[_212∈3@3]<br /><relational_items>"]]:::plan
    First_216["First[_216∈3@3]"]:::plan
    PgSelectSingle_217["PgSelectSingle[_217∈3@3]<br /><relational_items>"]:::plan
    PgClassExpression_218["PgClassExpression[_218∈3@3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_219["PgPolymorphic[_219∈3@3]"]:::plan
    First_233["First[_233∈3@3]"]:::plan
    PgSelectSingle_234["PgSelectSingle[_234∈3@3]<br /><relational_posts>"]:::plan
    PgClassExpression_236["PgClassExpression[_236∈3@3]<br /><__relation...__.#quot;title#quot;>"]:::plan
    PgClassExpression_237["PgClassExpression[_237∈3@3]<br /><__relation...scription#quot;>"]:::plan
    PgClassExpression_238["PgClassExpression[_238∈3@3]<br /><__relation...s__.#quot;note#quot;>"]:::plan
    PgClassExpression_255["PgClassExpression[_255∈3@3]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    InputStaticLeaf_263["InputStaticLeaf[_263∈3@3]"]:::plan
    PgSelect_264[["PgSelect[_264∈3@3]<br /><relational_items>"]]:::plan
    First_268["First[_268∈3@3]"]:::plan
    PgSelectSingle_269["PgSelectSingle[_269∈3@3]<br /><relational_items>"]:::plan
    PgClassExpression_270["PgClassExpression[_270∈3@3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_271["PgPolymorphic[_271∈3@3]"]:::plan
    First_285["First[_285∈3@3]"]:::plan
    PgSelectSingle_286["PgSelectSingle[_286∈3@3]<br /><relational_posts>"]:::plan
    PgClassExpression_288["PgClassExpression[_288∈3@3]<br /><__relation...__.#quot;title#quot;>"]:::plan
    PgClassExpression_289["PgClassExpression[_289∈3@3]<br /><__relation...scription#quot;>"]:::plan
    PgClassExpression_290["PgClassExpression[_290∈3@3]<br /><__relation...s__.#quot;note#quot;>"]:::plan
    PgClassExpression_307["PgClassExpression[_307∈3@3]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    InputStaticLeaf_315["InputStaticLeaf[_315∈3@3]"]:::plan
    PgSelect_316[["PgSelect[_316∈3@3]<br /><relational_items>"]]:::plan
    First_320["First[_320∈3@3]"]:::plan
    PgSelectSingle_321["PgSelectSingle[_321∈3@3]<br /><relational_items>"]:::plan
    PgClassExpression_322["PgClassExpression[_322∈3@3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_323["PgPolymorphic[_323∈3@3]"]:::plan
    First_337["First[_337∈3@3]"]:::plan
    PgSelectSingle_338["PgSelectSingle[_338∈3@3]<br /><relational_posts>"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈3@3]<br /><__relation...__.#quot;title#quot;>"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈3@3]<br /><__relation...scription#quot;>"]:::plan
    PgClassExpression_342["PgClassExpression[_342∈3@3]<br /><__relation...s__.#quot;note#quot;>"]:::plan
    PgClassExpression_359["PgClassExpression[_359∈3@3]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    Access_361["Access[_361∈0] {1,2,3}<br /><_3.pgSettings>"]:::plan
    Access_362["Access[_362∈0] {1,2,3}<br /><_3.withPgClient>"]:::plan
    Object_363["Object[_363∈0] {1,2,3}<br /><{pgSettings,withPgClient}>"]:::plan
    Map_367["Map[_367∈2@2]<br /><_45:{#quot;0#quot;:1,#quot;1#quot;:2,#quot;2#quot;:3,#quot;3#quot;:4}>"]:::plan
    List_368["List[_368∈2@2]<br /><_367>"]:::plan
    Map_369["Map[_369∈2@2]<br /><_97:{#quot;0#quot;:1,#quot;1#quot;:2,#quot;2#quot;:3,#quot;3#quot;:4}>"]:::plan
    List_370["List[_370∈2@2]<br /><_369>"]:::plan
    Map_371["Map[_371∈2@2]<br /><_149:{#quot;0#quot;:1,#quot;1#quot;:2,#quot;2#quot;:3,#quot;3#quot;:4}>"]:::plan
    List_372["List[_372∈2@2]<br /><_371>"]:::plan
    Map_373["Map[_373∈3@3]<br /><_217:{#quot;0#quot;:1,#quot;1#quot;:2,#quot;2#quot;:3,#quot;3#quot;:4}>"]:::plan
    List_374["List[_374∈3@3]<br /><_373>"]:::plan
    Map_375["Map[_375∈3@3]<br /><_269:{#quot;0#quot;:1,#quot;1#quot;:2,#quot;2#quot;:3,#quot;3#quot;:4}>"]:::plan
    List_376["List[_376∈3@3]<br /><_375>"]:::plan
    Map_377["Map[_377∈3@3]<br /><_321:{#quot;0#quot;:1,#quot;1#quot;:2,#quot;2#quot;:3,#quot;3#quot;:4}>"]:::plan
    List_378["List[_378∈3@3]<br /><_377>"]:::plan

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
    __TrackedObject_6 -.-> P1
    PgClassExpression_22 -.-> P2
    PgClassExpression_38 -.-> P3
    __Value_5 -.-> P4
    PgPolymorphic_47 -.-> P5
    PgClassExpression_83 -.-> P6
    PgClassExpression_83 -.-> P7
    PgClassExpression_64 -.-> P8
    PgClassExpression_65 -.-> P9
    PgClassExpression_66 -.-> P10
    PgClassExpression_83 -.-> P11
    PgClassExpression_83 -.-> P12
    PgClassExpression_83 -.-> P13
    PgPolymorphic_99 -.-> P14
    PgClassExpression_135 -.-> P15
    PgClassExpression_135 -.-> P16
    PgClassExpression_116 -.-> P17
    PgClassExpression_117 -.-> P18
    PgClassExpression_118 -.-> P19
    PgClassExpression_135 -.-> P20
    PgClassExpression_135 -.-> P21
    PgClassExpression_135 -.-> P22
    PgPolymorphic_151 -.-> P23
    PgClassExpression_187 -.-> P24
    PgClassExpression_187 -.-> P25
    PgClassExpression_168 -.-> P26
    PgClassExpression_169 -.-> P27
    PgClassExpression_170 -.-> P28
    PgClassExpression_187 -.-> P29
    PgClassExpression_187 -.-> P30
    PgClassExpression_187 -.-> P31
    PgClassExpression_210 -.-> P32
    __Value_5 -.-> P33
    PgPolymorphic_219 -.-> P34
    PgClassExpression_255 -.-> P35
    PgClassExpression_255 -.-> P36
    PgClassExpression_236 -.-> P37
    PgClassExpression_237 -.-> P38
    PgClassExpression_238 -.-> P39
    PgClassExpression_255 -.-> P40
    PgClassExpression_255 -.-> P41
    PgClassExpression_255 -.-> P42
    PgPolymorphic_271 -.-> P43
    PgClassExpression_307 -.-> P44
    PgClassExpression_307 -.-> P45
    PgClassExpression_288 -.-> P46
    PgClassExpression_289 -.-> P47
    PgClassExpression_290 -.-> P48
    PgClassExpression_307 -.-> P49
    PgClassExpression_307 -.-> P50
    PgClassExpression_307 -.-> P51
    PgPolymorphic_323 -.-> P52
    PgClassExpression_359 -.-> P53
    PgClassExpression_359 -.-> P54
    PgClassExpression_340 -.-> P55
    PgClassExpression_341 -.-> P56
    PgClassExpression_342 -.-> P57
    PgClassExpression_359 -.-> P58
    PgClassExpression_359 -.-> P59
    PgClassExpression_359 -.-> P60

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,Access_361,Access_362,Object_363 bucket0
    classDef bucket1 stroke:#a52a2a
    class InputStaticLeaf_8,InputStaticLeaf_9,InputStaticLeaf_10,Constant_11,Constant_12,PgInsert_13,PgClassExpression_17,PgInsert_18,PgClassExpression_22 bucket1
    classDef bucket2 stroke:#808000
    class InputStaticLeaf_24,InputStaticLeaf_25,InputStaticLeaf_26,Constant_27,Constant_28,PgInsert_29,PgClassExpression_33,PgInsert_34,PgClassExpression_38,InputStaticLeaf_39,PgSelect_40,First_44,PgSelectSingle_45,PgClassExpression_46,PgPolymorphic_47,First_61,PgSelectSingle_62,PgClassExpression_64,PgClassExpression_65,PgClassExpression_66,PgClassExpression_83,InputStaticLeaf_91,PgSelect_92,First_96,PgSelectSingle_97,PgClassExpression_98,PgPolymorphic_99,First_113,PgSelectSingle_114,PgClassExpression_116,PgClassExpression_117,PgClassExpression_118,PgClassExpression_135,InputStaticLeaf_143,PgSelect_144,First_148,PgSelectSingle_149,PgClassExpression_150,PgPolymorphic_151,First_165,PgSelectSingle_166,PgClassExpression_168,PgClassExpression_169,PgClassExpression_170,PgClassExpression_187,Map_367,List_368,Map_369,List_370,Map_371,List_372 bucket2
    classDef bucket3 stroke:#3cb371
    class InputStaticLeaf_196,InputStaticLeaf_197,InputStaticLeaf_198,Constant_199,Constant_200,PgInsert_201,PgClassExpression_205,PgInsert_206,PgClassExpression_210,InputStaticLeaf_211,PgSelect_212,First_216,PgSelectSingle_217,PgClassExpression_218,PgPolymorphic_219,First_233,PgSelectSingle_234,PgClassExpression_236,PgClassExpression_237,PgClassExpression_238,PgClassExpression_255,InputStaticLeaf_263,PgSelect_264,First_268,PgSelectSingle_269,PgClassExpression_270,PgPolymorphic_271,First_285,PgSelectSingle_286,PgClassExpression_288,PgClassExpression_289,PgClassExpression_290,PgClassExpression_307,InputStaticLeaf_315,PgSelect_316,First_320,PgSelectSingle_321,PgClassExpression_322,PgPolymorphic_323,First_337,PgSelectSingle_338,PgClassExpression_340,PgClassExpression_341,PgClassExpression_342,PgClassExpression_359,Map_373,List_374,Map_375,List_376,Map_377,List_378 bucket3

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (group 1 / mutation)<br />~"):::bucket
    style Bucket1 stroke:#a52a2a
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (group 2 / mutation)<br />~"):::bucket
    style Bucket2 stroke:#808000
    Bucket0 --> Bucket2
    Bucket3("Bucket 3 (group 3 / mutation)<br />~"):::bucket
    style Bucket3 stroke:#3cb371
    Bucket0 --> Bucket3
    end
```
