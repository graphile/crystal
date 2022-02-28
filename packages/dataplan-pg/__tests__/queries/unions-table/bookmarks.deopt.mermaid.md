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
    InputStaticLeaf_7["InputStaticLeaf[_7∈0]"]:::plan
    PgSelect_8[["PgSelect[_8∈0]<br />ᐸpeopleᐳ"]]:::plan
    First_12["First[_12∈0]"]:::plan
    PgSelectSingle_13["PgSelectSingle[_13∈0]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_14["PgClassExpression[_14∈0]<br />ᐸ__people__.”person_id”ᐳ"]:::plan
    PgClassExpression_15["PgClassExpression[_15∈0]<br />ᐸ__people__.”username”ᐳ"]:::plan
    __Item_21>"__Item[_21∈1]<br />ᐸ_92ᐳ"]:::itemplan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br />ᐸperson_bookmarksᐳ"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br />ᐸ__person_b...rks__.”id”ᐳ"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈1]<br />ᐸ__person_b...person_id”ᐳ"]:::plan
    PgSelect_25[["PgSelect[_25∈1]<br />ᐸpeopleᐳ"]]:::plan
    First_29["First[_29∈1]"]:::plan
    PgSelectSingle_30["PgSelectSingle[_30∈1]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_31["PgClassExpression[_31∈1]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgClassExpression_32["PgClassExpression[_32∈1]<br />ᐸ__person_b...ed_entity”ᐳ"]:::plan
    PgClassExpression_33["PgClassExpression[_33∈1]<br />ᐸ(__person_...person_id”ᐳ"]:::plan
    PgClassExpression_34["PgClassExpression[_34∈1]<br />ᐸ(__person_....”post_id”ᐳ"]:::plan
    PgClassExpression_35["PgClassExpression[_35∈1]<br />ᐸ(__person_...omment_id”ᐳ"]:::plan
    List_36["List[_36∈1]<br />ᐸ_33,_34,_35ᐳ"]:::plan
    PgPolymorphic_37["PgPolymorphic[_37∈1]"]:::plan
    First_42["First[_42∈1]"]:::plan
    PgSelectSingle_43["PgSelectSingle[_43∈2]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_44["PgClassExpression[_44∈2]<br />ᐸ__people__.”person_id”ᐳ"]:::plan
    PgClassExpression_45["PgClassExpression[_45∈2]<br />ᐸ__people__.”username”ᐳ"]:::plan
    First_50["First[_50∈1]"]:::plan
    PgSelectSingle_51["PgSelectSingle[_51∈3]<br />ᐸpostsᐳ"]:::plan
    PgClassExpression_52["PgClassExpression[_52∈3]<br />ᐸ__posts__.”post_id”ᐳ"]:::plan
    PgClassExpression_53["PgClassExpression[_53∈3]<br />ᐸ__posts__.”author_id”ᐳ"]:::plan
    PgSelect_54[["PgSelect[_54∈3]<br />ᐸpeopleᐳ"]]:::plan
    First_58["First[_58∈3]"]:::plan
    PgSelectSingle_59["PgSelectSingle[_59∈3]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈3]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgClassExpression_61["PgClassExpression[_61∈3]<br />ᐸ__posts__.”body”ᐳ"]:::plan
    First_66["First[_66∈1]"]:::plan
    PgSelectSingle_67["PgSelectSingle[_67∈4]<br />ᐸcommentsᐳ"]:::plan
    PgClassExpression_68["PgClassExpression[_68∈4]<br />ᐸ__comments...omment_id”ᐳ"]:::plan
    PgClassExpression_69["PgClassExpression[_69∈4]<br />ᐸ__comments...author_id”ᐳ"]:::plan
    PgSelect_70[["PgSelect[_70∈4]<br />ᐸpeopleᐳ"]]:::plan
    First_74["First[_74∈4]"]:::plan
    PgSelectSingle_75["PgSelectSingle[_75∈4]<br />ᐸpeopleᐳ"]:::plan
    PgClassExpression_76["PgClassExpression[_76∈4]<br />ᐸ__people__.”username”ᐳ"]:::plan
    PgClassExpression_77["PgClassExpression[_77∈4]<br />ᐸ__comments__.”post_id”ᐳ"]:::plan
    PgSelect_78[["PgSelect[_78∈4]<br />ᐸpostsᐳ"]]:::plan
    Access_79["Access[_79∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_80["Access[_80∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_81["Object[_81∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    First_82["First[_82∈4]"]:::plan
    PgSelectSingle_83["PgSelectSingle[_83∈4]<br />ᐸpostsᐳ"]:::plan
    PgClassExpression_84["PgClassExpression[_84∈4]<br />ᐸ__posts__.”body”ᐳ"]:::plan
    PgClassExpression_85["PgClassExpression[_85∈4]<br />ᐸ__comments__.”body”ᐳ"]:::plan
    Map_86["Map[_86∈1]<br />ᐸ_22:{”0”:3,”1”:4}ᐳ"]:::plan
    List_87["List[_87∈1]<br />ᐸ_86ᐳ"]:::plan
    Map_88["Map[_88∈1]<br />ᐸ_22:{”0”:6,”1”:7,”2”:8}ᐳ"]:::plan
    List_89["List[_89∈1]<br />ᐸ_88ᐳ"]:::plan
    Map_90["Map[_90∈1]<br />ᐸ_22:{”0”:10,”1”:11,”2”:12,”3”:13}ᐳ"]:::plan
    List_91["List[_91∈1]<br />ᐸ_90ᐳ"]:::plan
    Access_92["Access[_92∈0]<br />ᐸ_12.0ᐳ"]:::plan

    %% plan dependencies
    Object_81 --> PgSelect_8
    InputStaticLeaf_7 --> PgSelect_8
    PgSelect_8 --> First_12
    First_12 --> PgSelectSingle_13
    PgSelectSingle_13 --> PgClassExpression_14
    PgSelectSingle_13 --> PgClassExpression_15
    Access_92 ==> __Item_21
    __Item_21 --> PgSelectSingle_22
    PgSelectSingle_22 --> PgClassExpression_23
    PgSelectSingle_22 --> PgClassExpression_24
    Object_81 --> PgSelect_25
    PgClassExpression_24 --> PgSelect_25
    PgSelect_25 --> First_29
    First_29 --> PgSelectSingle_30
    PgSelectSingle_30 --> PgClassExpression_31
    PgSelectSingle_22 --> PgClassExpression_32
    PgSelectSingle_22 --> PgClassExpression_33
    PgSelectSingle_22 --> PgClassExpression_34
    PgSelectSingle_22 --> PgClassExpression_35
    PgClassExpression_33 --> List_36
    PgClassExpression_34 --> List_36
    PgClassExpression_35 --> List_36
    PgClassExpression_32 --> PgPolymorphic_37
    List_36 --> PgPolymorphic_37
    List_87 --> First_42
    First_42 --> PgSelectSingle_43
    PgSelectSingle_43 --> PgClassExpression_44
    PgSelectSingle_43 --> PgClassExpression_45
    List_89 --> First_50
    First_50 --> PgSelectSingle_51
    PgSelectSingle_51 --> PgClassExpression_52
    PgSelectSingle_51 --> PgClassExpression_53
    Object_81 --> PgSelect_54
    PgClassExpression_53 --> PgSelect_54
    PgSelect_54 --> First_58
    First_58 --> PgSelectSingle_59
    PgSelectSingle_59 --> PgClassExpression_60
    PgSelectSingle_51 --> PgClassExpression_61
    List_91 --> First_66
    First_66 --> PgSelectSingle_67
    PgSelectSingle_67 --> PgClassExpression_68
    PgSelectSingle_67 --> PgClassExpression_69
    Object_81 --> PgSelect_70
    PgClassExpression_69 --> PgSelect_70
    PgSelect_70 --> First_74
    First_74 --> PgSelectSingle_75
    PgSelectSingle_75 --> PgClassExpression_76
    PgSelectSingle_67 --> PgClassExpression_77
    Object_81 --> PgSelect_78
    PgClassExpression_77 --> PgSelect_78
    __Value_3 --> Access_79
    __Value_3 --> Access_80
    Access_79 --> Object_81
    Access_80 --> Object_81
    PgSelect_78 --> First_82
    First_82 --> PgSelectSingle_83
    PgSelectSingle_83 --> PgClassExpression_84
    PgSelectSingle_67 --> PgClassExpression_85
    PgSelectSingle_22 --> Map_86
    Map_86 --> List_87
    PgSelectSingle_22 --> Map_88
    Map_88 --> List_89
    PgSelectSingle_22 --> Map_90
    Map_90 --> List_91
    First_12 --> Access_92

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_13["ᐳpersonByPersonId"]
    PgSelectSingle_13 -.-> P_13
    P_14["ᐳp…dᐳpersonId"]
    PgClassExpression_14 -.-> P_14
    P_15["ᐳp…dᐳusername"]
    PgClassExpression_15 -.-> P_15
    P_22["ᐳp…dᐳpersonBookmarksList[]"]
    PgSelectSingle_22 -.-> P_22
    P_23["ᐳp…dᐳp…]ᐳid"]
    PgClassExpression_23 -.-> P_23
    P_30["ᐳp…dᐳp…]ᐳperson"]
    PgSelectSingle_30 -.-> P_30
    P_31["ᐳp…dᐳp…]ᐳp…nᐳusername"]
    PgClassExpression_31 -.-> P_31
    P_37["ᐳp…dᐳp…]ᐳbookmarkedEntity"]
    PgPolymorphic_37 -.-> P_37
    P_44["ᐳp…dᐳp…]ᐳb…yᐳpersonId"]
    PgClassExpression_44 -.-> P_44
    P_45["ᐳp…dᐳp…]ᐳb…yᐳusername"]
    PgClassExpression_45 -.-> P_45
    P_52["ᐳp…dᐳp…]ᐳb…yᐳpostId"]
    PgClassExpression_52 -.-> P_52
    P_59["ᐳp…dᐳp…]ᐳb…yᐳauthor"]
    PgSelectSingle_59 -.-> P_59
    P_60["ᐳp…dᐳp…]ᐳb…yᐳa…rᐳusername"]
    PgClassExpression_60 -.-> P_60
    P_61["ᐳp…dᐳp…]ᐳb…yᐳbody"]
    PgClassExpression_61 -.-> P_61
    P_68["ᐳp…dᐳp…]ᐳb…yᐳcommentId"]
    PgClassExpression_68 -.-> P_68
    P_75["ᐳp…dᐳp…]ᐳb…yᐳauthor"]
    PgSelectSingle_75 -.-> P_75
    P_76["ᐳp…dᐳp…]ᐳb…yᐳa…rᐳusername"]
    PgClassExpression_76 -.-> P_76
    P_83["ᐳp…dᐳp…]ᐳb…yᐳpost"]
    PgSelectSingle_83 -.-> P_83
    P_84["ᐳp…dᐳp…]ᐳb…yᐳpostᐳbody"]
    PgClassExpression_84 -.-> P_84
    P_85["ᐳp…dᐳp…]ᐳb…yᐳbody"]
    PgClassExpression_85 -.-> P_85
    P_92["ᐳp…dᐳpersonBookmarksList"]
    Access_92 -.-> P_92

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,InputStaticLeaf_7,PgSelect_8,First_12,PgSelectSingle_13,PgClassExpression_14,PgClassExpression_15,Access_79,Access_80,Object_81,Access_92 bucket0
    classDef bucket1 stroke:#00bfff
    class __Item_21,PgSelectSingle_22,PgClassExpression_23,PgClassExpression_24,PgSelect_25,First_29,PgSelectSingle_30,PgClassExpression_31,PgClassExpression_32,PgClassExpression_33,PgClassExpression_34,PgClassExpression_35,List_36,PgPolymorphic_37,First_42,First_50,First_66,Map_86,List_87,Map_88,List_89,Map_90,List_91 bucket1
    classDef bucket2 stroke:#7f007f
    class PgSelectSingle_43,PgClassExpression_44,PgClassExpression_45 bucket2
    classDef bucket3 stroke:#ffa500
    class PgSelectSingle_51,PgClassExpression_52,PgClassExpression_53,PgSelect_54,First_58,PgSelectSingle_59,PgClassExpression_60,PgClassExpression_61 bucket3
    classDef bucket4 stroke:#0000ff
    class PgSelectSingle_67,PgClassExpression_68,PgClassExpression_69,PgSelect_70,First_74,PgSelectSingle_75,PgClassExpression_76,PgClassExpression_77,PgSelect_78,First_82,PgSelectSingle_83,PgClassExpression_84,PgClassExpression_85 bucket4

    subgraph "Buckets for queries/unions-table/bookmarks"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀personByPersonId ᐸ-O- _13<br />⠀⠀⠀personByPersonId.personId ᐸ-L- _14<br />⠀⠀⠀personByPersonId.username ᐸ-L- _15<br />⠀⠀⠀personByPersonId.personBookmarksList ᐸ-A- _92"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_21)<br />Deps: _92, _81<br />~ᐳQuery.personByPersonIdᐳPerson.personBookmarksList[]<br />⠀ROOT ᐸ-O- _22<br />⠀⠀id ᐸ-L- _23<br />⠀⠀person ᐸ-O- _30<br />⠀⠀⠀person.username ᐸ-L- _31<br />⠀⠀bookmarkedEntity ᐸ-O- _37"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (polymorphic_37[Person])<br />Deps: _42<br />~ᐳQuery.personByPersonIdᐳPerson.personBookmarksList[]ᐳPersonBookmark.bookmarkedEntity<br />⠀⠀personId ᐸ-L- _44<br />⠀⠀username ᐸ-L- _45"):::bucket
    style Bucket2 stroke:#7f007f
    Bucket1 --> Bucket2
    Bucket3("Bucket 3 (polymorphic_37[Post])<br />Deps: _50, _81<br />~ᐳQuery.personByPersonIdᐳPerson.personBookmarksList[]ᐳPersonBookmark.bookmarkedEntity<br />⠀⠀postId ᐸ-L- _52<br />⠀⠀author ᐸ-O- _59<br />⠀⠀⠀author.username ᐸ-L- _60<br />⠀⠀body ᐸ-L- _61"):::bucket
    style Bucket3 stroke:#ffa500
    Bucket1 --> Bucket3
    Bucket4("Bucket 4 (polymorphic_37[Comment])<br />Deps: _66, _81<br />~ᐳQuery.personByPersonIdᐳPerson.personBookmarksList[]ᐳPersonBookmark.bookmarkedEntity<br />⠀⠀commentId ᐸ-L- _68<br />⠀⠀author ᐸ-O- _75<br />⠀⠀⠀author.username ᐸ-L- _76<br />⠀⠀post ᐸ-O- _83<br />⠀⠀⠀post.body ᐸ-L- _84<br />⠀⠀body ᐸ-L- _85"):::bucket
    style Bucket4 stroke:#0000ff
    Bucket1 --> Bucket4
    end
```