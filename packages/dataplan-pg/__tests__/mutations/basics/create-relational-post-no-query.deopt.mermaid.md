```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan
    __Value_5["__Value[_5∈0]<br />ᐸrootValueᐳ"]:::plan
    __TrackedObject_6["__TrackedObject[_6∈0]"]:::plan
    InputStaticLeaf_8["InputStaticLeaf[_8∈1@1]"]:::plan
    InputStaticLeaf_9["InputStaticLeaf[_9∈1@1]"]:::plan
    InputStaticLeaf_10["InputStaticLeaf[_10∈1@1]"]:::plan
    Constant_11["Constant[_11∈1@1]"]:::plan
    Constant_12["Constant[_12∈1@1]"]:::plan
    PgInsert_13[["PgInsert[_13∈1@1]"]]:::sideeffectplan
    PgClassExpression_17["PgClassExpression[_17∈1@1]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgInsert_18[["PgInsert[_18∈1@1]"]]:::sideeffectplan
    PgClassExpression_22["PgClassExpression[_22∈1@1]<br />ᐸ__relational_posts__ᐳ"]:::plan
    InputStaticLeaf_24["InputStaticLeaf[_24∈2@2]"]:::plan
    InputStaticLeaf_25["InputStaticLeaf[_25∈2@2]"]:::plan
    InputStaticLeaf_26["InputStaticLeaf[_26∈2@2]"]:::plan
    Constant_27["Constant[_27∈2@2]"]:::plan
    Constant_28["Constant[_28∈2@2]"]:::plan
    PgInsert_29[["PgInsert[_29∈2@2]"]]:::sideeffectplan
    PgClassExpression_33["PgClassExpression[_33∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgInsert_34[["PgInsert[_34∈2@2]"]]:::sideeffectplan
    PgClassExpression_38["PgClassExpression[_38∈2@2]<br />ᐸ__relational_posts__ᐳ"]:::plan
    InputStaticLeaf_39["InputStaticLeaf[_39∈2@2]"]:::plan
    PgSelect_40[["PgSelect[_40∈2@2]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_44["First[_44∈2@2]"]:::plan
    PgSelectSingle_45["PgSelectSingle[_45∈2@2]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_46["PgClassExpression[_46∈2@2]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_47["PgPolymorphic[_47∈2@2]"]:::plan
    PgSelect_57[["PgSelect[_57∈2@2]<br />ᐸrelational_postsᐳ"]]:::plan
    First_61["First[_61∈2@2]"]:::plan
    PgSelectSingle_62["PgSelectSingle[_62∈3@2]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_64["PgClassExpression[_64∈3@2]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_65["PgClassExpression[_65∈3@2]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_66["PgClassExpression[_66∈3@2]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgClassExpression_83["PgClassExpression[_83∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    InputStaticLeaf_91["InputStaticLeaf[_91∈2@2]"]:::plan
    PgSelect_92[["PgSelect[_92∈2@2]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_96["First[_96∈2@2]"]:::plan
    PgSelectSingle_97["PgSelectSingle[_97∈2@2]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_98["PgClassExpression[_98∈2@2]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_99["PgPolymorphic[_99∈2@2]"]:::plan
    PgSelect_109[["PgSelect[_109∈2@2]<br />ᐸrelational_postsᐳ"]]:::plan
    First_113["First[_113∈2@2]"]:::plan
    PgSelectSingle_114["PgSelectSingle[_114∈4@2]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_116["PgClassExpression[_116∈4@2]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_117["PgClassExpression[_117∈4@2]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_118["PgClassExpression[_118∈4@2]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgClassExpression_135["PgClassExpression[_135∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    InputStaticLeaf_143["InputStaticLeaf[_143∈2@2]"]:::plan
    PgSelect_144[["PgSelect[_144∈2@2]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_148["First[_148∈2@2]"]:::plan
    PgSelectSingle_149["PgSelectSingle[_149∈2@2]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_150["PgClassExpression[_150∈2@2]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_151["PgPolymorphic[_151∈2@2]"]:::plan
    PgSelect_161[["PgSelect[_161∈2@2]<br />ᐸrelational_postsᐳ"]]:::plan
    First_165["First[_165∈2@2]"]:::plan
    PgSelectSingle_166["PgSelectSingle[_166∈5@2]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈5@2]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_169["PgClassExpression[_169∈5@2]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_170["PgClassExpression[_170∈5@2]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgClassExpression_187["PgClassExpression[_187∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    InputStaticLeaf_196["InputStaticLeaf[_196∈6@3]"]:::plan
    InputStaticLeaf_197["InputStaticLeaf[_197∈6@3]"]:::plan
    InputStaticLeaf_198["InputStaticLeaf[_198∈6@3]"]:::plan
    Constant_199["Constant[_199∈6@3]"]:::plan
    Constant_200["Constant[_200∈6@3]"]:::plan
    PgInsert_201[["PgInsert[_201∈6@3]"]]:::sideeffectplan
    PgClassExpression_205["PgClassExpression[_205∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgInsert_206[["PgInsert[_206∈6@3]"]]:::sideeffectplan
    PgClassExpression_210["PgClassExpression[_210∈6@3]<br />ᐸ__relational_posts__ᐳ"]:::plan
    InputStaticLeaf_211["InputStaticLeaf[_211∈6@3]"]:::plan
    PgSelect_212[["PgSelect[_212∈6@3]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_216["First[_216∈6@3]"]:::plan
    PgSelectSingle_217["PgSelectSingle[_217∈6@3]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_218["PgClassExpression[_218∈6@3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_219["PgPolymorphic[_219∈6@3]"]:::plan
    PgSelect_229[["PgSelect[_229∈6@3]<br />ᐸrelational_postsᐳ"]]:::plan
    First_233["First[_233∈6@3]"]:::plan
    PgSelectSingle_234["PgSelectSingle[_234∈7@3]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_236["PgClassExpression[_236∈7@3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_237["PgClassExpression[_237∈7@3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_238["PgClassExpression[_238∈7@3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgClassExpression_255["PgClassExpression[_255∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    InputStaticLeaf_263["InputStaticLeaf[_263∈6@3]"]:::plan
    PgSelect_264[["PgSelect[_264∈6@3]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_268["First[_268∈6@3]"]:::plan
    PgSelectSingle_269["PgSelectSingle[_269∈6@3]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_270["PgClassExpression[_270∈6@3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_271["PgPolymorphic[_271∈6@3]"]:::plan
    PgSelect_281[["PgSelect[_281∈6@3]<br />ᐸrelational_postsᐳ"]]:::plan
    First_285["First[_285∈6@3]"]:::plan
    PgSelectSingle_286["PgSelectSingle[_286∈8@3]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_288["PgClassExpression[_288∈8@3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_289["PgClassExpression[_289∈8@3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_290["PgClassExpression[_290∈8@3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgClassExpression_307["PgClassExpression[_307∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    InputStaticLeaf_315["InputStaticLeaf[_315∈6@3]"]:::plan
    PgSelect_316[["PgSelect[_316∈6@3]<br />ᐸrelational_itemsᐳ"]]:::plan
    First_320["First[_320∈6@3]"]:::plan
    PgSelectSingle_321["PgSelectSingle[_321∈6@3]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_322["PgClassExpression[_322∈6@3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgPolymorphic_323["PgPolymorphic[_323∈6@3]"]:::plan
    PgSelect_333[["PgSelect[_333∈6@3]<br />ᐸrelational_postsᐳ"]]:::plan
    First_337["First[_337∈6@3]"]:::plan
    PgSelectSingle_338["PgSelectSingle[_338∈9@3]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_340["PgClassExpression[_340∈9@3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_341["PgClassExpression[_341∈9@3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_342["PgClassExpression[_342∈9@3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgClassExpression_359["PgClassExpression[_359∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    Access_361["Access[_361∈0] {1,2,3}<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_362["Access[_362∈0] {1,2,3}<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_363["Object[_363∈0] {1,2,3}<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan

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
    P_0["~"]
    __Value_0 -.-> P_0
    P_5["ᐳp2ᐳquery<br />ᐳp3ᐳquery"]
    __Value_5 -.-> P_5
    P_22["ᐳp1"]
    PgClassExpression_22 -.-> P_22
    P_38["ᐳp2"]
    PgClassExpression_38 -.-> P_38
    P_47["ᐳp2ᐳq…yᐳi1"]
    PgPolymorphic_47 -.-> P_47
    P_64["ᐳp2ᐳq…yᐳi1ᐳtitle"]
    PgClassExpression_64 -.-> P_64
    P_65["ᐳp2ᐳq…yᐳi1ᐳdescription"]
    PgClassExpression_65 -.-> P_65
    P_66["ᐳp2ᐳq…yᐳi1ᐳnote"]
    PgClassExpression_66 -.-> P_66
    P_83["ᐳp2ᐳq…yᐳi1ᐳid x5"]
    PgClassExpression_83 -.-> P_83
    P_99["ᐳp2ᐳq…yᐳi2"]
    PgPolymorphic_99 -.-> P_99
    P_116["ᐳp2ᐳq…yᐳi2ᐳtitle"]
    PgClassExpression_116 -.-> P_116
    P_117["ᐳp2ᐳq…yᐳi2ᐳdescription"]
    PgClassExpression_117 -.-> P_117
    P_118["ᐳp2ᐳq…yᐳi2ᐳnote"]
    PgClassExpression_118 -.-> P_118
    P_135["ᐳp2ᐳq…yᐳi2ᐳid x5"]
    PgClassExpression_135 -.-> P_135
    P_151["ᐳp2ᐳq…yᐳi3"]
    PgPolymorphic_151 -.-> P_151
    P_168["ᐳp2ᐳq…yᐳi3ᐳtitle"]
    PgClassExpression_168 -.-> P_168
    P_169["ᐳp2ᐳq…yᐳi3ᐳdescription"]
    PgClassExpression_169 -.-> P_169
    P_170["ᐳp2ᐳq…yᐳi3ᐳnote"]
    PgClassExpression_170 -.-> P_170
    P_187["ᐳp2ᐳq…yᐳi3ᐳid x5"]
    PgClassExpression_187 -.-> P_187
    P_210["ᐳp3"]
    PgClassExpression_210 -.-> P_210
    P_219["ᐳp3ᐳq…yᐳi1"]
    PgPolymorphic_219 -.-> P_219
    P_236["ᐳp3ᐳq…yᐳi1ᐳtitle"]
    PgClassExpression_236 -.-> P_236
    P_237["ᐳp3ᐳq…yᐳi1ᐳdescription"]
    PgClassExpression_237 -.-> P_237
    P_238["ᐳp3ᐳq…yᐳi1ᐳnote"]
    PgClassExpression_238 -.-> P_238
    P_255["ᐳp3ᐳq…yᐳi1ᐳid x5"]
    PgClassExpression_255 -.-> P_255
    P_271["ᐳp3ᐳq…yᐳi2"]
    PgPolymorphic_271 -.-> P_271
    P_288["ᐳp3ᐳq…yᐳi2ᐳtitle"]
    PgClassExpression_288 -.-> P_288
    P_289["ᐳp3ᐳq…yᐳi2ᐳdescription"]
    PgClassExpression_289 -.-> P_289
    P_290["ᐳp3ᐳq…yᐳi2ᐳnote"]
    PgClassExpression_290 -.-> P_290
    P_307["ᐳp3ᐳq…yᐳi2ᐳid x5"]
    PgClassExpression_307 -.-> P_307
    P_323["ᐳp3ᐳq…yᐳi3"]
    PgPolymorphic_323 -.-> P_323
    P_340["ᐳp3ᐳq…yᐳi3ᐳtitle"]
    PgClassExpression_340 -.-> P_340
    P_341["ᐳp3ᐳq…yᐳi3ᐳdescription"]
    PgClassExpression_341 -.-> P_341
    P_342["ᐳp3ᐳq…yᐳi3ᐳnote"]
    PgClassExpression_342 -.-> P_342
    P_359["ᐳp3ᐳq…yᐳi3ᐳid x5"]
    PgClassExpression_359 -.-> P_359

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,__Value_5,__TrackedObject_6,Access_361,Access_362,Object_363 bucket0
    classDef bucket1 stroke:#00bfff
    class InputStaticLeaf_8,InputStaticLeaf_9,InputStaticLeaf_10,Constant_11,Constant_12,PgInsert_13,PgClassExpression_17,PgInsert_18,PgClassExpression_22 bucket1
    classDef bucket2 stroke:#7f007f
    class InputStaticLeaf_24,InputStaticLeaf_25,InputStaticLeaf_26,Constant_27,Constant_28,PgInsert_29,PgClassExpression_33,PgInsert_34,PgClassExpression_38,InputStaticLeaf_39,PgSelect_40,First_44,PgSelectSingle_45,PgClassExpression_46,PgPolymorphic_47,PgSelect_57,First_61,PgClassExpression_83,InputStaticLeaf_91,PgSelect_92,First_96,PgSelectSingle_97,PgClassExpression_98,PgPolymorphic_99,PgSelect_109,First_113,PgClassExpression_135,InputStaticLeaf_143,PgSelect_144,First_148,PgSelectSingle_149,PgClassExpression_150,PgPolymorphic_151,PgSelect_161,First_165,PgClassExpression_187 bucket2
    classDef bucket3 stroke:#ffa500
    class PgSelectSingle_62,PgClassExpression_64,PgClassExpression_65,PgClassExpression_66 bucket3
    classDef bucket4 stroke:#0000ff
    class PgSelectSingle_114,PgClassExpression_116,PgClassExpression_117,PgClassExpression_118 bucket4
    classDef bucket5 stroke:#7fff00
    class PgSelectSingle_166,PgClassExpression_168,PgClassExpression_169,PgClassExpression_170 bucket5
    classDef bucket6 stroke:#ff1493
    class InputStaticLeaf_196,InputStaticLeaf_197,InputStaticLeaf_198,Constant_199,Constant_200,PgInsert_201,PgClassExpression_205,PgInsert_206,PgClassExpression_210,InputStaticLeaf_211,PgSelect_212,First_216,PgSelectSingle_217,PgClassExpression_218,PgPolymorphic_219,PgSelect_229,First_233,PgClassExpression_255,InputStaticLeaf_263,PgSelect_264,First_268,PgSelectSingle_269,PgClassExpression_270,PgPolymorphic_271,PgSelect_281,First_285,PgClassExpression_307,InputStaticLeaf_315,PgSelect_316,First_320,PgSelectSingle_321,PgClassExpression_322,PgPolymorphic_323,PgSelect_333,First_337,PgClassExpression_359 bucket6
    classDef bucket7 stroke:#808000
    class PgSelectSingle_234,PgClassExpression_236,PgClassExpression_237,PgClassExpression_238 bucket7
    classDef bucket8 stroke:#dda0dd
    class PgSelectSingle_286,PgClassExpression_288,PgClassExpression_289,PgClassExpression_290 bucket8
    classDef bucket9 stroke:#ff0000
    class PgSelectSingle_338,PgClassExpression_340,PgClassExpression_341,PgClassExpression_342 bucket9

    subgraph "Buckets for mutations/basics/create-relational-post-no-query"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (group1[mutation])<br />Deps: _363<br />~ᐳMutation.p1<br />⠀ROOT ᐸ-O- _22"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (group2[mutation])<br />Deps: _363, _5<br />~ᐳMutation.p2<br />⠀ROOT ᐸ-O- _38<br />⠀⠀query ᐸ-O- _5<br />⠀⠀⠀query.i1 ᐸ-O- _47<br />⠀⠀⠀⠀query.i1.id ᐸ-L- _83<br />⠀⠀⠀query.i2 ᐸ-O- _99<br />⠀⠀⠀⠀query.i2.id ᐸ-L- _135<br />⠀⠀⠀query.i3 ᐸ-O- _151<br />⠀⠀⠀⠀query.i3.id ᐸ-L- _187"):::bucket
    style Bucket2 stroke:#7f007f
    Bucket0 --> Bucket2
    Bucket3("Bucket 3 (polymorphic_47[RelationalPost])<br />Deps: _61<br />~ᐳMutation.p2ᐳCreateRelationalPostPayload.queryᐳQuery.i1<br />⠀⠀title ᐸ-L- _64<br />⠀⠀description ᐸ-L- _65<br />⠀⠀note ᐸ-L- _66"):::bucket
    style Bucket3 stroke:#ffa500
    Bucket2 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_99[RelationalPost])<br />Deps: _113<br />~ᐳMutation.p2ᐳCreateRelationalPostPayload.queryᐳQuery.i2<br />⠀⠀title ᐸ-L- _116<br />⠀⠀description ᐸ-L- _117<br />⠀⠀note ᐸ-L- _118"):::bucket
    style Bucket4 stroke:#0000ff
    Bucket2 --> Bucket4
    Bucket5("Bucket 5 (polymorphic_151[RelationalPost])<br />Deps: _165<br />~ᐳMutation.p2ᐳCreateRelationalPostPayload.queryᐳQuery.i3<br />⠀⠀title ᐸ-L- _168<br />⠀⠀description ᐸ-L- _169<br />⠀⠀note ᐸ-L- _170"):::bucket
    style Bucket5 stroke:#7fff00
    Bucket2 --> Bucket5
    Bucket6("Bucket 6 (group3[mutation])<br />Deps: _363, _5<br />~ᐳMutation.p3<br />⠀ROOT ᐸ-O- _210<br />⠀⠀query ᐸ-O- _5<br />⠀⠀⠀query.i1 ᐸ-O- _219<br />⠀⠀⠀⠀query.i1.id ᐸ-L- _255<br />⠀⠀⠀query.i2 ᐸ-O- _271<br />⠀⠀⠀⠀query.i2.id ᐸ-L- _307<br />⠀⠀⠀query.i3 ᐸ-O- _323<br />⠀⠀⠀⠀query.i3.id ᐸ-L- _359"):::bucket
    style Bucket6 stroke:#ff1493
    Bucket0 --> Bucket6
    Bucket7("Bucket 7 (polymorphic_219[RelationalPost])<br />Deps: _233<br />~ᐳMutation.p3ᐳCreateRelationalPostPayload.queryᐳQuery.i1<br />⠀⠀title ᐸ-L- _236<br />⠀⠀description ᐸ-L- _237<br />⠀⠀note ᐸ-L- _238"):::bucket
    style Bucket7 stroke:#808000
    Bucket6 --> Bucket7
    Bucket8("Bucket 8 (polymorphic_271[RelationalPost])<br />Deps: _285<br />~ᐳMutation.p3ᐳCreateRelationalPostPayload.queryᐳQuery.i2<br />⠀⠀title ᐸ-L- _288<br />⠀⠀description ᐸ-L- _289<br />⠀⠀note ᐸ-L- _290"):::bucket
    style Bucket8 stroke:#dda0dd
    Bucket6 --> Bucket8
    Bucket9("Bucket 9 (polymorphic_323[RelationalPost])<br />Deps: _337<br />~ᐳMutation.p3ᐳCreateRelationalPostPayload.queryᐳQuery.i3<br />⠀⠀title ᐸ-L- _340<br />⠀⠀description ᐸ-L- _341<br />⠀⠀note ᐸ-L- _342"):::bucket
    style Bucket9 stroke:#ff0000
    Bucket6 --> Bucket9
    end
```
