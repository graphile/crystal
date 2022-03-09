```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value0["__Value[0∈0]"]:::plan
    PgClassExpression22["PgClassExpression[22∈1@1]<br />ᐸ__relational_posts__ᐳ"]:::plan
    PgInsert18[["PgInsert[18∈1@1]"]]:::sideeffectplan
    PgClassExpression17["PgClassExpression[17∈1@1]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgInsert13[["PgInsert[13∈1@1]"]]:::sideeffectplan
    PgClassExpression38["PgClassExpression[38∈2@2]<br />ᐸ__relational_posts__ᐳ"]:::plan
    PgInsert34[["PgInsert[34∈2@2]"]]:::sideeffectplan
    PgClassExpression33["PgClassExpression[33∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgInsert29[["PgInsert[29∈2@2]"]]:::sideeffectplan
    PgPolymorphic47["PgPolymorphic[47∈2@2]"]:::plan
    PgClassExpression46["PgClassExpression[46∈2@2]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression64["PgClassExpression[64∈3@2]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression65["PgClassExpression[65∈3@2]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression66["PgClassExpression[66∈3@2]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle62["PgSelectSingle[62∈3@2]<br />ᐸrelational_postsᐳ"]:::plan
    First61["First[61∈2@2]"]:::plan
    PgSelect57[["PgSelect[57∈2@2]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression83["PgClassExpression[83∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgSelectSingle45["PgSelectSingle[45∈2@2]<br />ᐸrelational_itemsᐳ"]:::plan
    First44["First[44∈2@2]"]:::plan
    PgSelect40[["PgSelect[40∈2@2]<br />ᐸrelational_itemsᐳ"]]:::plan
    PgPolymorphic99["PgPolymorphic[99∈2@2]"]:::plan
    PgClassExpression98["PgClassExpression[98∈2@2]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression116["PgClassExpression[116∈4@2]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression117["PgClassExpression[117∈4@2]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression118["PgClassExpression[118∈4@2]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle114["PgSelectSingle[114∈4@2]<br />ᐸrelational_postsᐳ"]:::plan
    First113["First[113∈2@2]"]:::plan
    PgSelect109[["PgSelect[109∈2@2]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression135["PgClassExpression[135∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgSelectSingle97["PgSelectSingle[97∈2@2]<br />ᐸrelational_itemsᐳ"]:::plan
    First96["First[96∈2@2]"]:::plan
    PgSelect92[["PgSelect[92∈2@2]<br />ᐸrelational_itemsᐳ"]]:::plan
    PgPolymorphic151["PgPolymorphic[151∈2@2]"]:::plan
    PgClassExpression150["PgClassExpression[150∈2@2]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression168["PgClassExpression[168∈5@2]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression169["PgClassExpression[169∈5@2]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression170["PgClassExpression[170∈5@2]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle166["PgSelectSingle[166∈5@2]<br />ᐸrelational_postsᐳ"]:::plan
    First165["First[165∈2@2]"]:::plan
    PgSelect161[["PgSelect[161∈2@2]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression187["PgClassExpression[187∈2@2]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgSelectSingle149["PgSelectSingle[149∈2@2]<br />ᐸrelational_itemsᐳ"]:::plan
    First148["First[148∈2@2]"]:::plan
    PgSelect144[["PgSelect[144∈2@2]<br />ᐸrelational_itemsᐳ"]]:::plan
    PgClassExpression210["PgClassExpression[210∈6@3]<br />ᐸ__relational_posts__ᐳ"]:::plan
    PgInsert206[["PgInsert[206∈6@3]"]]:::sideeffectplan
    PgClassExpression205["PgClassExpression[205∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgInsert201[["PgInsert[201∈6@3]"]]:::sideeffectplan
    PgPolymorphic219["PgPolymorphic[219∈6@3]"]:::plan
    PgClassExpression218["PgClassExpression[218∈6@3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression236["PgClassExpression[236∈7@3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression237["PgClassExpression[237∈7@3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression238["PgClassExpression[238∈7@3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle234["PgSelectSingle[234∈7@3]<br />ᐸrelational_postsᐳ"]:::plan
    First233["First[233∈6@3]"]:::plan
    PgSelect229[["PgSelect[229∈6@3]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression255["PgClassExpression[255∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgSelectSingle217["PgSelectSingle[217∈6@3]<br />ᐸrelational_itemsᐳ"]:::plan
    First216["First[216∈6@3]"]:::plan
    PgSelect212[["PgSelect[212∈6@3]<br />ᐸrelational_itemsᐳ"]]:::plan
    PgPolymorphic271["PgPolymorphic[271∈6@3]"]:::plan
    PgClassExpression270["PgClassExpression[270∈6@3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression288["PgClassExpression[288∈8@3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression289["PgClassExpression[289∈8@3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression290["PgClassExpression[290∈8@3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle286["PgSelectSingle[286∈8@3]<br />ᐸrelational_postsᐳ"]:::plan
    First285["First[285∈6@3]"]:::plan
    PgSelect281[["PgSelect[281∈6@3]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression307["PgClassExpression[307∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgSelectSingle269["PgSelectSingle[269∈6@3]<br />ᐸrelational_itemsᐳ"]:::plan
    First268["First[268∈6@3]"]:::plan
    PgSelect264[["PgSelect[264∈6@3]<br />ᐸrelational_itemsᐳ"]]:::plan
    PgPolymorphic323["PgPolymorphic[323∈6@3]"]:::plan
    PgClassExpression322["PgClassExpression[322∈6@3]<br />ᐸ__relation...s__.”type”ᐳ"]:::plan
    PgClassExpression340["PgClassExpression[340∈9@3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression341["PgClassExpression[341∈9@3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression342["PgClassExpression[342∈9@3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    PgSelectSingle338["PgSelectSingle[338∈9@3]<br />ᐸrelational_postsᐳ"]:::plan
    First337["First[337∈6@3]"]:::plan
    PgSelect333[["PgSelect[333∈6@3]<br />ᐸrelational_postsᐳ"]]:::plan
    PgClassExpression359["PgClassExpression[359∈6@3]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgSelectSingle321["PgSelectSingle[321∈6@3]<br />ᐸrelational_itemsᐳ"]:::plan
    First320["First[320∈6@3]"]:::plan
    PgSelect316[["PgSelect[316∈6@3]<br />ᐸrelational_itemsᐳ"]]:::plan
    Object363["Object[363∈0] {1,2,3}<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access361["Access[361∈0] {1,2,3}<br />ᐸ3.pgSettingsᐳ"]:::plan
    Access362["Access[362∈0] {1,2,3}<br />ᐸ3.withPgClientᐳ"]:::plan
    __Value3["__Value[3∈0]<br />ᐸcontextᐳ"]:::plan
    __TrackedObject6["__TrackedObject[6∈0]"]:::plan
    __Value5["__Value[5∈0]<br />ᐸrootValueᐳ"]:::plan
    InputStaticLeaf8["InputStaticLeaf[8∈1@1]"]:::plan
    InputStaticLeaf9["InputStaticLeaf[9∈1@1]"]:::plan
    InputStaticLeaf10["InputStaticLeaf[10∈1@1]"]:::plan
    Constant11["Constant[11∈1@1]"]:::plan
    Constant12["Constant[12∈1@1]"]:::plan
    InputStaticLeaf24["InputStaticLeaf[24∈2@2]"]:::plan
    InputStaticLeaf25["InputStaticLeaf[25∈2@2]"]:::plan
    InputStaticLeaf26["InputStaticLeaf[26∈2@2]"]:::plan
    Constant27["Constant[27∈2@2]"]:::plan
    Constant28["Constant[28∈2@2]"]:::plan
    InputStaticLeaf39["InputStaticLeaf[39∈2@2]"]:::plan
    InputStaticLeaf91["InputStaticLeaf[91∈2@2]"]:::plan
    InputStaticLeaf143["InputStaticLeaf[143∈2@2]"]:::plan
    InputStaticLeaf196["InputStaticLeaf[196∈6@3]"]:::plan
    InputStaticLeaf197["InputStaticLeaf[197∈6@3]"]:::plan
    InputStaticLeaf198["InputStaticLeaf[198∈6@3]"]:::plan
    Constant199["Constant[199∈6@3]"]:::plan
    Constant200["Constant[200∈6@3]"]:::plan
    InputStaticLeaf211["InputStaticLeaf[211∈6@3]"]:::plan
    InputStaticLeaf263["InputStaticLeaf[263∈6@3]"]:::plan
    InputStaticLeaf315["InputStaticLeaf[315∈6@3]"]:::plan

    %% plan dependencies
    PgInsert18 --> PgClassExpression22
    Object363 & PgClassExpression17 & InputStaticLeaf8 & InputStaticLeaf9 & InputStaticLeaf10 --> PgInsert18
    PgInsert13 --> PgClassExpression17
    Object363 & Constant11 & Constant12 --> PgInsert13
    PgInsert34 --> PgClassExpression38
    Object363 & PgClassExpression33 & InputStaticLeaf24 & InputStaticLeaf25 & InputStaticLeaf26 --> PgInsert34
    PgInsert29 --> PgClassExpression33
    Object363 & Constant27 & Constant28 --> PgInsert29
    PgSelectSingle45 & PgClassExpression46 --> PgPolymorphic47
    PgSelectSingle45 --> PgClassExpression46
    PgSelectSingle62 --> PgClassExpression64
    PgSelectSingle62 --> PgClassExpression65
    PgSelectSingle62 --> PgClassExpression66
    First61 --> PgSelectSingle62
    PgSelect57 --> First61
    Object363 & PgClassExpression83 --> PgSelect57
    PgSelectSingle45 --> PgClassExpression83
    First44 --> PgSelectSingle45
    PgSelect40 --> First44
    Object363 & InputStaticLeaf39 --> PgSelect40
    PgSelectSingle97 & PgClassExpression98 --> PgPolymorphic99
    PgSelectSingle97 --> PgClassExpression98
    PgSelectSingle114 --> PgClassExpression116
    PgSelectSingle114 --> PgClassExpression117
    PgSelectSingle114 --> PgClassExpression118
    First113 --> PgSelectSingle114
    PgSelect109 --> First113
    Object363 & PgClassExpression135 --> PgSelect109
    PgSelectSingle97 --> PgClassExpression135
    First96 --> PgSelectSingle97
    PgSelect92 --> First96
    Object363 & InputStaticLeaf91 --> PgSelect92
    PgSelectSingle149 & PgClassExpression150 --> PgPolymorphic151
    PgSelectSingle149 --> PgClassExpression150
    PgSelectSingle166 --> PgClassExpression168
    PgSelectSingle166 --> PgClassExpression169
    PgSelectSingle166 --> PgClassExpression170
    First165 --> PgSelectSingle166
    PgSelect161 --> First165
    Object363 & PgClassExpression187 --> PgSelect161
    PgSelectSingle149 --> PgClassExpression187
    First148 --> PgSelectSingle149
    PgSelect144 --> First148
    Object363 & InputStaticLeaf143 --> PgSelect144
    PgInsert206 --> PgClassExpression210
    Object363 & PgClassExpression205 & InputStaticLeaf196 & InputStaticLeaf197 & InputStaticLeaf198 --> PgInsert206
    PgInsert201 --> PgClassExpression205
    Object363 & Constant199 & Constant200 --> PgInsert201
    PgSelectSingle217 & PgClassExpression218 --> PgPolymorphic219
    PgSelectSingle217 --> PgClassExpression218
    PgSelectSingle234 --> PgClassExpression236
    PgSelectSingle234 --> PgClassExpression237
    PgSelectSingle234 --> PgClassExpression238
    First233 --> PgSelectSingle234
    PgSelect229 --> First233
    Object363 & PgClassExpression255 --> PgSelect229
    PgSelectSingle217 --> PgClassExpression255
    First216 --> PgSelectSingle217
    PgSelect212 --> First216
    Object363 & InputStaticLeaf211 --> PgSelect212
    PgSelectSingle269 & PgClassExpression270 --> PgPolymorphic271
    PgSelectSingle269 --> PgClassExpression270
    PgSelectSingle286 --> PgClassExpression288
    PgSelectSingle286 --> PgClassExpression289
    PgSelectSingle286 --> PgClassExpression290
    First285 --> PgSelectSingle286
    PgSelect281 --> First285
    Object363 & PgClassExpression307 --> PgSelect281
    PgSelectSingle269 --> PgClassExpression307
    First268 --> PgSelectSingle269
    PgSelect264 --> First268
    Object363 & InputStaticLeaf263 --> PgSelect264
    PgSelectSingle321 & PgClassExpression322 --> PgPolymorphic323
    PgSelectSingle321 --> PgClassExpression322
    PgSelectSingle338 --> PgClassExpression340
    PgSelectSingle338 --> PgClassExpression341
    PgSelectSingle338 --> PgClassExpression342
    First337 --> PgSelectSingle338
    PgSelect333 --> First337
    Object363 & PgClassExpression359 --> PgSelect333
    PgSelectSingle321 --> PgClassExpression359
    First320 --> PgSelectSingle321
    PgSelect316 --> First320
    Object363 & InputStaticLeaf315 --> PgSelect316
    Access361 & Access362 --> Object363
    __Value3 --> Access361
    __Value3 --> Access362
    __Value5 --> __TrackedObject6

    %% plan-to-path relationships
    P0["~"]
    __Value0 -.-> P0
    P5["ᐳp2ᐳquery<br />ᐳp3ᐳquery"]
    __Value5 -.-> P5
    P22["ᐳp1"]
    PgClassExpression22 -.-> P22
    P38["ᐳp2"]
    PgClassExpression38 -.-> P38
    P47["ᐳp2ᐳq…yᐳi1"]
    PgPolymorphic47 -.-> P47
    P64["ᐳp2ᐳq…yᐳi1ᐳtitle"]
    PgClassExpression64 -.-> P64
    P65["ᐳp2ᐳq…yᐳi1ᐳdescription"]
    PgClassExpression65 -.-> P65
    P66["ᐳp2ᐳq…yᐳi1ᐳnote"]
    PgClassExpression66 -.-> P66
    P83["ᐳp2ᐳq…yᐳi1ᐳid x5"]
    PgClassExpression83 -.-> P83
    P99["ᐳp2ᐳq…yᐳi2"]
    PgPolymorphic99 -.-> P99
    P116["ᐳp2ᐳq…yᐳi2ᐳtitle"]
    PgClassExpression116 -.-> P116
    P117["ᐳp2ᐳq…yᐳi2ᐳdescription"]
    PgClassExpression117 -.-> P117
    P118["ᐳp2ᐳq…yᐳi2ᐳnote"]
    PgClassExpression118 -.-> P118
    P135["ᐳp2ᐳq…yᐳi2ᐳid x5"]
    PgClassExpression135 -.-> P135
    P151["ᐳp2ᐳq…yᐳi3"]
    PgPolymorphic151 -.-> P151
    P168["ᐳp2ᐳq…yᐳi3ᐳtitle"]
    PgClassExpression168 -.-> P168
    P169["ᐳp2ᐳq…yᐳi3ᐳdescription"]
    PgClassExpression169 -.-> P169
    P170["ᐳp2ᐳq…yᐳi3ᐳnote"]
    PgClassExpression170 -.-> P170
    P187["ᐳp2ᐳq…yᐳi3ᐳid x5"]
    PgClassExpression187 -.-> P187
    P210["ᐳp3"]
    PgClassExpression210 -.-> P210
    P219["ᐳp3ᐳq…yᐳi1"]
    PgPolymorphic219 -.-> P219
    P236["ᐳp3ᐳq…yᐳi1ᐳtitle"]
    PgClassExpression236 -.-> P236
    P237["ᐳp3ᐳq…yᐳi1ᐳdescription"]
    PgClassExpression237 -.-> P237
    P238["ᐳp3ᐳq…yᐳi1ᐳnote"]
    PgClassExpression238 -.-> P238
    P255["ᐳp3ᐳq…yᐳi1ᐳid x5"]
    PgClassExpression255 -.-> P255
    P271["ᐳp3ᐳq…yᐳi2"]
    PgPolymorphic271 -.-> P271
    P288["ᐳp3ᐳq…yᐳi2ᐳtitle"]
    PgClassExpression288 -.-> P288
    P289["ᐳp3ᐳq…yᐳi2ᐳdescription"]
    PgClassExpression289 -.-> P289
    P290["ᐳp3ᐳq…yᐳi2ᐳnote"]
    PgClassExpression290 -.-> P290
    P307["ᐳp3ᐳq…yᐳi2ᐳid x5"]
    PgClassExpression307 -.-> P307
    P323["ᐳp3ᐳq…yᐳi3"]
    PgPolymorphic323 -.-> P323
    P340["ᐳp3ᐳq…yᐳi3ᐳtitle"]
    PgClassExpression340 -.-> P340
    P341["ᐳp3ᐳq…yᐳi3ᐳdescription"]
    PgClassExpression341 -.-> P341
    P342["ᐳp3ᐳq…yᐳi3ᐳnote"]
    PgClassExpression342 -.-> P342
    P359["ᐳp3ᐳq…yᐳi3ᐳid x5"]
    PgClassExpression359 -.-> P359

    subgraph "Buckets for mutations/basics/create-relational-post-no-query"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- 0"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value0,__Value3,__Value5,__TrackedObject6,Access361,Access362,Object363 bucket0
    Bucket1("Bucket 1 (group1[mutation])<br />Deps: 363<br />~ᐳMutation.p1<br />⠀ROOT ᐸ-O- 22"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,InputStaticLeaf8,InputStaticLeaf9,InputStaticLeaf10,Constant11,Constant12,PgInsert13,PgClassExpression17,PgInsert18,PgClassExpression22 bucket1
    Bucket2("Bucket 2 (group2[mutation])<br />Deps: 363, 5<br />~ᐳMutation.p2<br />⠀ROOT ᐸ-O- 38<br />⠀⠀query ᐸ-O- 5<br />⠀⠀⠀query.i1 ᐸ-O- 47<br />⠀⠀⠀⠀query.i1.id ᐸ-L- 83<br />⠀⠀⠀query.i2 ᐸ-O- 99<br />⠀⠀⠀⠀query.i2.id ᐸ-L- 135<br />⠀⠀⠀query.i3 ᐸ-O- 151<br />⠀⠀⠀⠀query.i3.id ᐸ-L- 187"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,InputStaticLeaf24,InputStaticLeaf25,InputStaticLeaf26,Constant27,Constant28,PgInsert29,PgClassExpression33,PgInsert34,PgClassExpression38,InputStaticLeaf39,PgSelect40,First44,PgSelectSingle45,PgClassExpression46,PgPolymorphic47,PgSelect57,First61,PgClassExpression83,InputStaticLeaf91,PgSelect92,First96,PgSelectSingle97,PgClassExpression98,PgPolymorphic99,PgSelect109,First113,PgClassExpression135,InputStaticLeaf143,PgSelect144,First148,PgSelectSingle149,PgClassExpression150,PgPolymorphic151,PgSelect161,First165,PgClassExpression187 bucket2
    Bucket3("Bucket 3 (polymorphic47[RelationalPost])<br />Deps: 61<br />~ᐳMutation.p2ᐳCreateRelationalPostPayload.queryᐳQuery.i1<br />⠀⠀title ᐸ-L- 64<br />⠀⠀description ᐸ-L- 65<br />⠀⠀note ᐸ-L- 66"):::bucket
    classDef bucket3 stroke:#ffa500
    class Bucket3,PgSelectSingle62,PgClassExpression64,PgClassExpression65,PgClassExpression66 bucket3
    Bucket4("Bucket 4 (polymorphic99[RelationalPost])<br />Deps: 113<br />~ᐳMutation.p2ᐳCreateRelationalPostPayload.queryᐳQuery.i2<br />⠀⠀title ᐸ-L- 116<br />⠀⠀description ᐸ-L- 117<br />⠀⠀note ᐸ-L- 118"):::bucket
    classDef bucket4 stroke:#0000ff
    class Bucket4,PgSelectSingle114,PgClassExpression116,PgClassExpression117,PgClassExpression118 bucket4
    Bucket5("Bucket 5 (polymorphic151[RelationalPost])<br />Deps: 165<br />~ᐳMutation.p2ᐳCreateRelationalPostPayload.queryᐳQuery.i3<br />⠀⠀title ᐸ-L- 168<br />⠀⠀description ᐸ-L- 169<br />⠀⠀note ᐸ-L- 170"):::bucket
    classDef bucket5 stroke:#7fff00
    class Bucket5,PgSelectSingle166,PgClassExpression168,PgClassExpression169,PgClassExpression170 bucket5
    Bucket6("Bucket 6 (group3[mutation])<br />Deps: 363, 5<br />~ᐳMutation.p3<br />⠀ROOT ᐸ-O- 210<br />⠀⠀query ᐸ-O- 5<br />⠀⠀⠀query.i1 ᐸ-O- 219<br />⠀⠀⠀⠀query.i1.id ᐸ-L- 255<br />⠀⠀⠀query.i2 ᐸ-O- 271<br />⠀⠀⠀⠀query.i2.id ᐸ-L- 307<br />⠀⠀⠀query.i3 ᐸ-O- 323<br />⠀⠀⠀⠀query.i3.id ᐸ-L- 359"):::bucket
    classDef bucket6 stroke:#ff1493
    class Bucket6,InputStaticLeaf196,InputStaticLeaf197,InputStaticLeaf198,Constant199,Constant200,PgInsert201,PgClassExpression205,PgInsert206,PgClassExpression210,InputStaticLeaf211,PgSelect212,First216,PgSelectSingle217,PgClassExpression218,PgPolymorphic219,PgSelect229,First233,PgClassExpression255,InputStaticLeaf263,PgSelect264,First268,PgSelectSingle269,PgClassExpression270,PgPolymorphic271,PgSelect281,First285,PgClassExpression307,InputStaticLeaf315,PgSelect316,First320,PgSelectSingle321,PgClassExpression322,PgPolymorphic323,PgSelect333,First337,PgClassExpression359 bucket6
    Bucket7("Bucket 7 (polymorphic219[RelationalPost])<br />Deps: 233<br />~ᐳMutation.p3ᐳCreateRelationalPostPayload.queryᐳQuery.i1<br />⠀⠀title ᐸ-L- 236<br />⠀⠀description ᐸ-L- 237<br />⠀⠀note ᐸ-L- 238"):::bucket
    classDef bucket7 stroke:#808000
    class Bucket7,PgSelectSingle234,PgClassExpression236,PgClassExpression237,PgClassExpression238 bucket7
    Bucket8("Bucket 8 (polymorphic271[RelationalPost])<br />Deps: 285<br />~ᐳMutation.p3ᐳCreateRelationalPostPayload.queryᐳQuery.i2<br />⠀⠀title ᐸ-L- 288<br />⠀⠀description ᐸ-L- 289<br />⠀⠀note ᐸ-L- 290"):::bucket
    classDef bucket8 stroke:#dda0dd
    class Bucket8,PgSelectSingle286,PgClassExpression288,PgClassExpression289,PgClassExpression290 bucket8
    Bucket9("Bucket 9 (polymorphic323[RelationalPost])<br />Deps: 337<br />~ᐳMutation.p3ᐳCreateRelationalPostPayload.queryᐳQuery.i3<br />⠀⠀title ᐸ-L- 340<br />⠀⠀description ᐸ-L- 341<br />⠀⠀note ᐸ-L- 342"):::bucket
    classDef bucket9 stroke:#ff0000
    class Bucket9,PgSelectSingle338,PgClassExpression340,PgClassExpression341,PgClassExpression342 bucket9
    Bucket0 --> Bucket1 & Bucket2 & Bucket6
    Bucket2 --> Bucket3 & Bucket4 & Bucket5
    Bucket6 --> Bucket7 & Bucket8 & Bucket9
    end
```
