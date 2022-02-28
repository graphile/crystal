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
    InputStaticLeaf_11["InputStaticLeaf[_11∈1@1]"]:::plan
    PgUpdate_13[["PgUpdate[_13∈1@1]"]]:::sideeffectplan
    PgClassExpression_17["PgClassExpression[_17∈1@1]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgSelect_19[["PgSelect[_19∈1@1]<br />ᐸrelational_postsᐳ"]]:::plan
    First_23["First[_23∈1@1]"]:::plan
    PgSelectSingle_24["PgSelectSingle[_24∈1@1]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_25["PgClassExpression[_25∈1@1]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgClassExpression_26["PgClassExpression[_26∈1@1]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_27["PgClassExpression[_27∈1@1]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_28["PgClassExpression[_28∈1@1]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    First_34["First[_34∈1@1]"]:::plan
    PgSelectSingle_35["PgSelectSingle[_35∈1@1]<br />ᐸtextᐳ"]:::plan
    PgClassExpression_36["PgClassExpression[_36∈1@1]<br />ᐸ__relation...le_lower__ᐳ"]:::plan
    First_42["First[_42∈1@1]"]:::plan
    PgSelectSingle_43["PgSelectSingle[_43∈1@1]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_44["PgClassExpression[_44∈1@1]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_52["PgClassExpression[_52∈1@1]<br />ᐸ__relation...author_id”ᐳ"]:::plan
    PgSelect_53[["PgSelect[_53∈1@1]<br />ᐸpeopleᐳ"]]:::plan
    First_57["First[_57∈1@1]"]:::plan
    PgSelectSingle_58["PgSelectSingle[_58∈1@1]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_59["PgClassExpression[_59∈1@1]<br />ᐸ__people__.”person_id”ᐳ"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈1@1]<br />ᐸ__people__.”username”ᐳ"]:::plan
    InputStaticLeaf_62["InputStaticLeaf[_62∈2@2]"]:::plan
    InputStaticLeaf_66["InputStaticLeaf[_66∈2@2]"]:::plan
    PgUpdate_67[["PgUpdate[_67∈2@2]"]]:::sideeffectplan
    PgClassExpression_71["PgClassExpression[_71∈2@2]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgSelect_73[["PgSelect[_73∈2@2]<br />ᐸrelational_postsᐳ"]]:::plan
    First_77["First[_77∈2@2]"]:::plan
    PgSelectSingle_78["PgSelectSingle[_78∈2@2]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_79["PgClassExpression[_79∈2@2]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgClassExpression_80["PgClassExpression[_80∈2@2]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_81["PgClassExpression[_81∈2@2]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_82["PgClassExpression[_82∈2@2]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    First_88["First[_88∈2@2]"]:::plan
    PgSelectSingle_89["PgSelectSingle[_89∈2@2]<br />ᐸtextᐳ"]:::plan
    PgClassExpression_90["PgClassExpression[_90∈2@2]<br />ᐸ__relation...le_lower__ᐳ"]:::plan
    First_96["First[_96∈2@2]"]:::plan
    PgSelectSingle_97["PgSelectSingle[_97∈2@2]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_98["PgClassExpression[_98∈2@2]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_106["PgClassExpression[_106∈2@2]<br />ᐸ__relation...author_id”ᐳ"]:::plan
    PgSelect_107[["PgSelect[_107∈2@2]<br />ᐸpeopleᐳ"]]:::plan
    First_111["First[_111∈2@2]"]:::plan
    PgSelectSingle_112["PgSelectSingle[_112∈2@2]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_113["PgClassExpression[_113∈2@2]<br />ᐸ__people__.”person_id”ᐳ"]:::plan
    PgClassExpression_114["PgClassExpression[_114∈2@2]<br />ᐸ__people__.”username”ᐳ"]:::plan
    InputStaticLeaf_116["InputStaticLeaf[_116∈3@3]"]:::plan
    InputStaticLeaf_119["InputStaticLeaf[_119∈3@3]"]:::plan
    PgUpdate_121[["PgUpdate[_121∈3@3]"]]:::sideeffectplan
    PgClassExpression_125["PgClassExpression[_125∈3@3]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgSelect_127[["PgSelect[_127∈3@3]<br />ᐸrelational_postsᐳ"]]:::plan
    First_131["First[_131∈3@3]"]:::plan
    PgSelectSingle_132["PgSelectSingle[_132∈3@3]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_133["PgClassExpression[_133∈3@3]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgClassExpression_134["PgClassExpression[_134∈3@3]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_135["PgClassExpression[_135∈3@3]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_136["PgClassExpression[_136∈3@3]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    First_142["First[_142∈3@3]"]:::plan
    PgSelectSingle_143["PgSelectSingle[_143∈3@3]<br />ᐸtextᐳ"]:::plan
    PgClassExpression_144["PgClassExpression[_144∈3@3]<br />ᐸ__relation...le_lower__ᐳ"]:::plan
    First_150["First[_150∈3@3]"]:::plan
    PgSelectSingle_151["PgSelectSingle[_151∈3@3]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_152["PgClassExpression[_152∈3@3]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_160["PgClassExpression[_160∈3@3]<br />ᐸ__relation...author_id”ᐳ"]:::plan
    PgSelect_161[["PgSelect[_161∈3@3]<br />ᐸpeopleᐳ"]]:::plan
    First_165["First[_165∈3@3]"]:::plan
    PgSelectSingle_166["PgSelectSingle[_166∈3@3]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_167["PgClassExpression[_167∈3@3]<br />ᐸ__people__.”person_id”ᐳ"]:::plan
    PgClassExpression_168["PgClassExpression[_168∈3@3]<br />ᐸ__people__.”username”ᐳ"]:::plan
    InputStaticLeaf_170["InputStaticLeaf[_170∈4@4]"]:::plan
    InputStaticLeaf_173["InputStaticLeaf[_173∈4@4]"]:::plan
    PgUpdate_175[["PgUpdate[_175∈4@4]"]]:::sideeffectplan
    PgClassExpression_179["PgClassExpression[_179∈4@4]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgSelect_181[["PgSelect[_181∈4@4]<br />ᐸrelational_postsᐳ"]]:::plan
    First_185["First[_185∈4@4]"]:::plan
    PgSelectSingle_186["PgSelectSingle[_186∈4@4]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_187["PgClassExpression[_187∈4@4]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgClassExpression_188["PgClassExpression[_188∈4@4]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_189["PgClassExpression[_189∈4@4]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_190["PgClassExpression[_190∈4@4]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan
    First_196["First[_196∈4@4]"]:::plan
    PgSelectSingle_197["PgSelectSingle[_197∈4@4]<br />ᐸtextᐳ"]:::plan
    PgClassExpression_198["PgClassExpression[_198∈4@4]<br />ᐸ__relation...le_lower__ᐳ"]:::plan
    First_204["First[_204∈4@4]"]:::plan
    PgSelectSingle_205["PgSelectSingle[_205∈4@4]<br />ᐸrelational_itemsᐳ"]:::plan
    PgClassExpression_206["PgClassExpression[_206∈4@4]<br />ᐸ__relation..._archived”ᐳ"]:::plan
    PgClassExpression_214["PgClassExpression[_214∈4@4]<br />ᐸ__relation...author_id”ᐳ"]:::plan
    PgSelect_215[["PgSelect[_215∈4@4]<br />ᐸpeopleᐳ"]]:::plan
    Access_216["Access[_216∈0] {1,2,3,4}<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_217["Access[_217∈0] {1,2,3,4}<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_218["Object[_218∈0] {1,2,3,4}<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    First_219["First[_219∈4@4]"]:::plan
    PgSelectSingle_220["PgSelectSingle[_220∈4@4]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_221["PgClassExpression[_221∈4@4]<br />ᐸ__people__.”person_id”ᐳ"]:::plan
    PgClassExpression_222["PgClassExpression[_222∈4@4]<br />ᐸ__people__.”username”ᐳ"]:::plan
    Map_223["Map[_223∈1@1]<br />ᐸ_24:{”0”:0,”1”:1}ᐳ"]:::plan
    List_224["List[_224∈1@1]<br />ᐸ_223ᐳ"]:::plan
    Map_225["Map[_225∈1@1]<br />ᐸ_24:{”0”:6}ᐳ"]:::plan
    List_226["List[_226∈1@1]<br />ᐸ_225ᐳ"]:::plan
    Map_227["Map[_227∈2@2]<br />ᐸ_78:{”0”:0,”1”:1}ᐳ"]:::plan
    List_228["List[_228∈2@2]<br />ᐸ_227ᐳ"]:::plan
    Map_229["Map[_229∈2@2]<br />ᐸ_78:{”0”:6}ᐳ"]:::plan
    List_230["List[_230∈2@2]<br />ᐸ_229ᐳ"]:::plan
    Map_231["Map[_231∈3@3]<br />ᐸ_132:{”0”:0,”1”:1}ᐳ"]:::plan
    List_232["List[_232∈3@3]<br />ᐸ_231ᐳ"]:::plan
    Map_233["Map[_233∈3@3]<br />ᐸ_132:{”0”:6}ᐳ"]:::plan
    List_234["List[_234∈3@3]<br />ᐸ_233ᐳ"]:::plan
    Map_235["Map[_235∈4@4]<br />ᐸ_186:{”0”:0,”1”:1}ᐳ"]:::plan
    List_236["List[_236∈4@4]<br />ᐸ_235ᐳ"]:::plan
    Map_237["Map[_237∈4@4]<br />ᐸ_186:{”0”:6}ᐳ"]:::plan
    List_238["List[_238∈4@4]<br />ᐸ_237ᐳ"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_218 --> PgUpdate_13
    InputStaticLeaf_8 --> PgUpdate_13
    InputStaticLeaf_11 --> PgUpdate_13
    PgUpdate_13 --> PgClassExpression_17
    Object_218 --> PgSelect_19
    PgClassExpression_17 --> PgSelect_19
    PgSelect_19 --> First_23
    First_23 --> PgSelectSingle_24
    PgSelectSingle_24 --> PgClassExpression_25
    PgSelectSingle_24 --> PgClassExpression_26
    PgSelectSingle_24 --> PgClassExpression_27
    PgSelectSingle_24 --> PgClassExpression_28
    List_226 --> First_34
    First_34 --> PgSelectSingle_35
    PgSelectSingle_35 --> PgClassExpression_36
    List_224 --> First_42
    First_42 --> PgSelectSingle_43
    PgSelectSingle_43 --> PgClassExpression_44
    PgSelectSingle_43 --> PgClassExpression_52
    Object_218 --> PgSelect_53
    PgClassExpression_52 --> PgSelect_53
    PgSelect_53 --> First_57
    First_57 --> PgSelectSingle_58
    PgSelectSingle_58 --> PgClassExpression_59
    PgSelectSingle_58 --> PgClassExpression_60
    Object_218 --> PgUpdate_67
    InputStaticLeaf_62 --> PgUpdate_67
    InputStaticLeaf_66 --> PgUpdate_67
    PgUpdate_67 --> PgClassExpression_71
    Object_218 --> PgSelect_73
    PgClassExpression_71 --> PgSelect_73
    PgSelect_73 --> First_77
    First_77 --> PgSelectSingle_78
    PgSelectSingle_78 --> PgClassExpression_79
    PgSelectSingle_78 --> PgClassExpression_80
    PgSelectSingle_78 --> PgClassExpression_81
    PgSelectSingle_78 --> PgClassExpression_82
    List_230 --> First_88
    First_88 --> PgSelectSingle_89
    PgSelectSingle_89 --> PgClassExpression_90
    List_228 --> First_96
    First_96 --> PgSelectSingle_97
    PgSelectSingle_97 --> PgClassExpression_98
    PgSelectSingle_97 --> PgClassExpression_106
    Object_218 --> PgSelect_107
    PgClassExpression_106 --> PgSelect_107
    PgSelect_107 --> First_111
    First_111 --> PgSelectSingle_112
    PgSelectSingle_112 --> PgClassExpression_113
    PgSelectSingle_112 --> PgClassExpression_114
    Object_218 --> PgUpdate_121
    InputStaticLeaf_116 --> PgUpdate_121
    InputStaticLeaf_119 --> PgUpdate_121
    PgUpdate_121 --> PgClassExpression_125
    Object_218 --> PgSelect_127
    PgClassExpression_125 --> PgSelect_127
    PgSelect_127 --> First_131
    First_131 --> PgSelectSingle_132
    PgSelectSingle_132 --> PgClassExpression_133
    PgSelectSingle_132 --> PgClassExpression_134
    PgSelectSingle_132 --> PgClassExpression_135
    PgSelectSingle_132 --> PgClassExpression_136
    List_234 --> First_142
    First_142 --> PgSelectSingle_143
    PgSelectSingle_143 --> PgClassExpression_144
    List_232 --> First_150
    First_150 --> PgSelectSingle_151
    PgSelectSingle_151 --> PgClassExpression_152
    PgSelectSingle_151 --> PgClassExpression_160
    Object_218 --> PgSelect_161
    PgClassExpression_160 --> PgSelect_161
    PgSelect_161 --> First_165
    First_165 --> PgSelectSingle_166
    PgSelectSingle_166 --> PgClassExpression_167
    PgSelectSingle_166 --> PgClassExpression_168
    Object_218 --> PgUpdate_175
    InputStaticLeaf_170 --> PgUpdate_175
    InputStaticLeaf_173 --> PgUpdate_175
    PgUpdate_175 --> PgClassExpression_179
    Object_218 --> PgSelect_181
    PgClassExpression_179 --> PgSelect_181
    PgSelect_181 --> First_185
    First_185 --> PgSelectSingle_186
    PgSelectSingle_186 --> PgClassExpression_187
    PgSelectSingle_186 --> PgClassExpression_188
    PgSelectSingle_186 --> PgClassExpression_189
    PgSelectSingle_186 --> PgClassExpression_190
    List_238 --> First_196
    First_196 --> PgSelectSingle_197
    PgSelectSingle_197 --> PgClassExpression_198
    List_236 --> First_204
    First_204 --> PgSelectSingle_205
    PgSelectSingle_205 --> PgClassExpression_206
    PgSelectSingle_205 --> PgClassExpression_214
    Object_218 --> PgSelect_215
    PgClassExpression_214 --> PgSelect_215
    __Value_3 --> Access_216
    __Value_3 --> Access_217
    Access_216 --> Object_218
    Access_217 --> Object_218
    PgSelect_215 --> First_219
    First_219 --> PgSelectSingle_220
    PgSelectSingle_220 --> PgClassExpression_221
    PgSelectSingle_220 --> PgClassExpression_222
    PgSelectSingle_24 --> Map_223
    Map_223 --> List_224
    PgSelectSingle_24 --> Map_225
    Map_225 --> List_226
    PgSelectSingle_78 --> Map_227
    Map_227 --> List_228
    PgSelectSingle_78 --> Map_229
    Map_229 --> List_230
    PgSelectSingle_132 --> Map_231
    Map_231 --> List_232
    PgSelectSingle_132 --> Map_233
    Map_233 --> List_234
    PgSelectSingle_186 --> Map_235
    Map_235 --> List_236
    PgSelectSingle_186 --> Map_237
    Map_237 --> List_238

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_13["ᐳu1"]
    PgUpdate_13 -.-> P_13
    P_17["ᐳu1ᐳid"]
    PgClassExpression_17 -.-> P_17
    P_24["ᐳu1ᐳpost"]
    PgSelectSingle_24 -.-> P_24
    P_25["ᐳu1ᐳpostᐳid"]
    PgClassExpression_25 -.-> P_25
    P_26["ᐳu1ᐳpostᐳtitle"]
    PgClassExpression_26 -.-> P_26
    P_27["ᐳu1ᐳpostᐳdescription"]
    PgClassExpression_27 -.-> P_27
    P_28["ᐳu1ᐳpostᐳnote"]
    PgClassExpression_28 -.-> P_28
    P_36["ᐳu1ᐳpostᐳtitleLower"]
    PgClassExpression_36 -.-> P_36
    P_44["ᐳu1ᐳpostᐳisExplicitlyArchived"]
    PgClassExpression_44 -.-> P_44
    P_58["ᐳu1ᐳpostᐳauthor"]
    PgSelectSingle_58 -.-> P_58
    P_59["ᐳu1ᐳpostᐳa…rᐳpersonId"]
    PgClassExpression_59 -.-> P_59
    P_60["ᐳu1ᐳpostᐳa…rᐳusername"]
    PgClassExpression_60 -.-> P_60
    P_67["ᐳu2"]
    PgUpdate_67 -.-> P_67
    P_71["ᐳu2ᐳid"]
    PgClassExpression_71 -.-> P_71
    P_78["ᐳu2ᐳpost"]
    PgSelectSingle_78 -.-> P_78
    P_79["ᐳu2ᐳpostᐳid"]
    PgClassExpression_79 -.-> P_79
    P_80["ᐳu2ᐳpostᐳtitle"]
    PgClassExpression_80 -.-> P_80
    P_81["ᐳu2ᐳpostᐳdescription"]
    PgClassExpression_81 -.-> P_81
    P_82["ᐳu2ᐳpostᐳnote"]
    PgClassExpression_82 -.-> P_82
    P_90["ᐳu2ᐳpostᐳtitleLower"]
    PgClassExpression_90 -.-> P_90
    P_98["ᐳu2ᐳpostᐳisExplicitlyArchived"]
    PgClassExpression_98 -.-> P_98
    P_112["ᐳu2ᐳpostᐳauthor"]
    PgSelectSingle_112 -.-> P_112
    P_113["ᐳu2ᐳpostᐳa…rᐳpersonId"]
    PgClassExpression_113 -.-> P_113
    P_114["ᐳu2ᐳpostᐳa…rᐳusername"]
    PgClassExpression_114 -.-> P_114
    P_121["ᐳu3"]
    PgUpdate_121 -.-> P_121
    P_125["ᐳu3ᐳid"]
    PgClassExpression_125 -.-> P_125
    P_132["ᐳu3ᐳpost"]
    PgSelectSingle_132 -.-> P_132
    P_133["ᐳu3ᐳpostᐳid"]
    PgClassExpression_133 -.-> P_133
    P_134["ᐳu3ᐳpostᐳtitle"]
    PgClassExpression_134 -.-> P_134
    P_135["ᐳu3ᐳpostᐳdescription"]
    PgClassExpression_135 -.-> P_135
    P_136["ᐳu3ᐳpostᐳnote"]
    PgClassExpression_136 -.-> P_136
    P_144["ᐳu3ᐳpostᐳtitleLower"]
    PgClassExpression_144 -.-> P_144
    P_152["ᐳu3ᐳpostᐳisExplicitlyArchived"]
    PgClassExpression_152 -.-> P_152
    P_166["ᐳu3ᐳpostᐳauthor"]
    PgSelectSingle_166 -.-> P_166
    P_167["ᐳu3ᐳpostᐳa…rᐳpersonId"]
    PgClassExpression_167 -.-> P_167
    P_168["ᐳu3ᐳpostᐳa…rᐳusername"]
    PgClassExpression_168 -.-> P_168
    P_175["ᐳu4"]
    PgUpdate_175 -.-> P_175
    P_179["ᐳu4ᐳid"]
    PgClassExpression_179 -.-> P_179
    P_186["ᐳu4ᐳpost"]
    PgSelectSingle_186 -.-> P_186
    P_187["ᐳu4ᐳpostᐳid"]
    PgClassExpression_187 -.-> P_187
    P_188["ᐳu4ᐳpostᐳtitle"]
    PgClassExpression_188 -.-> P_188
    P_189["ᐳu4ᐳpostᐳdescription"]
    PgClassExpression_189 -.-> P_189
    P_190["ᐳu4ᐳpostᐳnote"]
    PgClassExpression_190 -.-> P_190
    P_198["ᐳu4ᐳpostᐳtitleLower"]
    PgClassExpression_198 -.-> P_198
    P_206["ᐳu4ᐳpostᐳisExplicitlyArchived"]
    PgClassExpression_206 -.-> P_206
    P_220["ᐳu4ᐳpostᐳauthor"]
    PgSelectSingle_220 -.-> P_220
    P_221["ᐳu4ᐳpostᐳa…rᐳpersonId"]
    PgClassExpression_221 -.-> P_221
    P_222["ᐳu4ᐳpostᐳa…rᐳusername"]
    PgClassExpression_222 -.-> P_222

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,__Value_5,__TrackedObject_6,Access_216,Access_217,Object_218 bucket0
    classDef bucket1 stroke:#00bfff
    class InputStaticLeaf_8,InputStaticLeaf_11,PgUpdate_13,PgClassExpression_17,PgSelect_19,First_23,PgSelectSingle_24,PgClassExpression_25,PgClassExpression_26,PgClassExpression_27,PgClassExpression_28,First_34,PgSelectSingle_35,PgClassExpression_36,First_42,PgSelectSingle_43,PgClassExpression_44,PgClassExpression_52,PgSelect_53,First_57,PgSelectSingle_58,PgClassExpression_59,PgClassExpression_60,Map_223,List_224,Map_225,List_226 bucket1
    classDef bucket2 stroke:#7f007f
    class InputStaticLeaf_62,InputStaticLeaf_66,PgUpdate_67,PgClassExpression_71,PgSelect_73,First_77,PgSelectSingle_78,PgClassExpression_79,PgClassExpression_80,PgClassExpression_81,PgClassExpression_82,First_88,PgSelectSingle_89,PgClassExpression_90,First_96,PgSelectSingle_97,PgClassExpression_98,PgClassExpression_106,PgSelect_107,First_111,PgSelectSingle_112,PgClassExpression_113,PgClassExpression_114,Map_227,List_228,Map_229,List_230 bucket2
    classDef bucket3 stroke:#ffa500
    class InputStaticLeaf_116,InputStaticLeaf_119,PgUpdate_121,PgClassExpression_125,PgSelect_127,First_131,PgSelectSingle_132,PgClassExpression_133,PgClassExpression_134,PgClassExpression_135,PgClassExpression_136,First_142,PgSelectSingle_143,PgClassExpression_144,First_150,PgSelectSingle_151,PgClassExpression_152,PgClassExpression_160,PgSelect_161,First_165,PgSelectSingle_166,PgClassExpression_167,PgClassExpression_168,Map_231,List_232,Map_233,List_234 bucket3
    classDef bucket4 stroke:#0000ff
    class InputStaticLeaf_170,InputStaticLeaf_173,PgUpdate_175,PgClassExpression_179,PgSelect_181,First_185,PgSelectSingle_186,PgClassExpression_187,PgClassExpression_188,PgClassExpression_189,PgClassExpression_190,First_196,PgSelectSingle_197,PgClassExpression_198,First_204,PgSelectSingle_205,PgClassExpression_206,PgClassExpression_214,PgSelect_215,First_219,PgSelectSingle_220,PgClassExpression_221,PgClassExpression_222,Map_235,List_236,Map_237,List_238 bucket4

    subgraph "Buckets for mutations/basics/update-relational-post"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (group1[mutation])<br />Deps: _218<br />~ᐳMutation.u1<br />⠀ROOT ᐸ-O- _13<br />⠀⠀id ᐸ-L- _17<br />⠀⠀post ᐸ-O- _24<br />⠀⠀⠀post.id ᐸ-L- _25<br />⠀⠀⠀post.title ᐸ-L- _26<br />⠀⠀⠀post.description ᐸ-L- _27<br />⠀⠀⠀post.note ᐸ-L- _28<br />⠀⠀⠀post.titleLower ᐸ-L- _36<br />⠀⠀⠀post.isExplicitlyArchived ᐸ-L- _44<br />⠀⠀⠀post.author ᐸ-O- _58<br />⠀⠀⠀⠀post.author.personId ᐸ-L- _59<br />⠀⠀⠀⠀post.author.username ᐸ-L- _60"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (group2[mutation])<br />Deps: _218<br />~ᐳMutation.u2<br />⠀ROOT ᐸ-O- _67<br />⠀⠀id ᐸ-L- _71<br />⠀⠀post ᐸ-O- _78<br />⠀⠀⠀post.id ᐸ-L- _79<br />⠀⠀⠀post.title ᐸ-L- _80<br />⠀⠀⠀post.description ᐸ-L- _81<br />⠀⠀⠀post.note ᐸ-L- _82<br />⠀⠀⠀post.titleLower ᐸ-L- _90<br />⠀⠀⠀post.isExplicitlyArchived ᐸ-L- _98<br />⠀⠀⠀post.author ᐸ-O- _112<br />⠀⠀⠀⠀post.author.personId ᐸ-L- _113<br />⠀⠀⠀⠀post.author.username ᐸ-L- _114"):::bucket
    style Bucket2 stroke:#7f007f
    Bucket0 --> Bucket2
    Bucket3("Bucket 3 (group3[mutation])<br />Deps: _218<br />~ᐳMutation.u3<br />⠀ROOT ᐸ-O- _121<br />⠀⠀id ᐸ-L- _125<br />⠀⠀post ᐸ-O- _132<br />⠀⠀⠀post.id ᐸ-L- _133<br />⠀⠀⠀post.title ᐸ-L- _134<br />⠀⠀⠀post.description ᐸ-L- _135<br />⠀⠀⠀post.note ᐸ-L- _136<br />⠀⠀⠀post.titleLower ᐸ-L- _144<br />⠀⠀⠀post.isExplicitlyArchived ᐸ-L- _152<br />⠀⠀⠀post.author ᐸ-O- _166<br />⠀⠀⠀⠀post.author.personId ᐸ-L- _167<br />⠀⠀⠀⠀post.author.username ᐸ-L- _168"):::bucket
    style Bucket3 stroke:#ffa500
    Bucket0 --> Bucket3
    Bucket4("Bucket 4 (group4[mutation])<br />Deps: _218<br />~ᐳMutation.u4<br />⠀ROOT ᐸ-O- _175<br />⠀⠀id ᐸ-L- _179<br />⠀⠀post ᐸ-O- _186<br />⠀⠀⠀post.id ᐸ-L- _187<br />⠀⠀⠀post.title ᐸ-L- _188<br />⠀⠀⠀post.description ᐸ-L- _189<br />⠀⠀⠀post.note ᐸ-L- _190<br />⠀⠀⠀post.titleLower ᐸ-L- _198<br />⠀⠀⠀post.isExplicitlyArchived ᐸ-L- _206<br />⠀⠀⠀post.author ᐸ-O- _220<br />⠀⠀⠀⠀post.author.personId ᐸ-L- _221<br />⠀⠀⠀⠀post.author.username ᐸ-L- _222"):::bucket
    style Bucket4 stroke:#0000ff
    Bucket0 --> Bucket4
    end
```
