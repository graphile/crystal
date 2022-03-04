```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    PgClassExpression_21["PgClassExpression[_21∈0]<br />ᐸ__forums_r...”username”ᐳ"]:::plan
    PgClassExpression_22["PgClassExpression[_22∈0]<br />ᐸ__forums_r...vatar_url”ᐳ"]:::plan
    PgClassExpression_46["PgClassExpression[_46∈1]<br />ᐸ__forums_f...s__.”body”ᐳ"]:::plan
    PgSelectSingle_45["PgSelectSingle[_45∈1]<br />ᐸforums_featured_messagesᐳ"]:::plan
    __Item_44>"__Item[_44∈1]<br />ᐸ_40ᐳ"]:::itemplan
    PgSelect_40[["PgSelect[_40∈0]<br />ᐸforums_featured_messagesᐳ"]]:::plan
    PgClassExpression_31["PgClassExpression[_31∈0]<br />ᐸ__users_mo...nt_forum__ᐳ"]:::plan
    PgClassExpression_38["PgClassExpression[_38∈0]<br />ᐸ__forums_u...or_count__ᐳ"]:::plan
    PgSelectSingle_37["PgSelectSingle[_37∈0]<br />ᐸforums_unique_author_countᐳ"]:::plan
    Map_47["Map[_47∈0]<br />ᐸ_29:{”0”:0}ᐳ"]:::plan
    PgSelectSingle_29["PgSelectSingle[_29∈0]<br />ᐸusers_most_recent_forumᐳ"]:::plan
    First_28["First[_28∈0]"]:::plan
    PgSelect_24[["PgSelect[_24∈0]<br />ᐸusers_most_recent_forumᐳ"]]:::plan
    PgClassExpression_23["PgClassExpression[_23∈0]<br />ᐸ__forums_random_user__ᐳ"]:::plan
    PgSelectSingle_20["PgSelectSingle[_20∈0]<br />ᐸusersᐳ"]:::plan
    First_19["First[_19∈0]"]:::plan
    PgSelect_15[["PgSelect[_15∈0]<br />ᐸforums_random_userᐳ"]]:::plan
    PgClassExpression_14["PgClassExpression[_14∈0]<br />ᐸ__forums__ᐳ"]:::plan
    PgSelectSingle_13["PgSelectSingle[_13∈0]<br />ᐸforumsᐳ"]:::plan
    First_12["First[_12∈0]"]:::plan
    PgSelect_8[["PgSelect[_8∈0]<br />ᐸforumsᐳ"]]:::plan
    Object_43["Object[_43∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_41["Access[_41∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_42["Access[_42∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan
    InputStaticLeaf_7["InputStaticLeaf[_7∈0]"]:::plan
    InputStaticLeaf_30["InputStaticLeaf[_30∈0]"]:::plan

    %% plan dependencies
    PgSelectSingle_20 --> PgClassExpression_21
    PgSelectSingle_20 --> PgClassExpression_22
    PgSelectSingle_45 --> PgClassExpression_46
    __Item_44 --> PgSelectSingle_45
    PgSelect_40 ==> __Item_44
    Object_43 & PgClassExpression_31 --> PgSelect_40
    PgSelectSingle_29 --> PgClassExpression_31
    PgSelectSingle_37 --> PgClassExpression_38
    Map_47 --> PgSelectSingle_37
    PgSelectSingle_29 --> Map_47
    First_28 --> PgSelectSingle_29
    PgSelect_24 --> First_28
    Object_43 & PgClassExpression_23 & InputStaticLeaf_30 --> PgSelect_24
    PgSelectSingle_20 --> PgClassExpression_23
    First_19 --> PgSelectSingle_20
    PgSelect_15 --> First_19
    Object_43 & PgClassExpression_14 --> PgSelect_15
    PgSelectSingle_13 --> PgClassExpression_14
    First_12 --> PgSelectSingle_13
    PgSelect_8 --> First_12
    Object_43 & InputStaticLeaf_7 --> PgSelect_8
    Access_41 & Access_42 --> Object_43
    __Value_3 --> Access_41
    __Value_3 --> Access_42

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_13["ᐳforum"]
    PgSelectSingle_13 -.-> P_13
    P_20["ᐳf…mᐳrandomUser"]
    PgSelectSingle_20 -.-> P_20
    P_21["ᐳf…mᐳr…rᐳusername"]
    PgClassExpression_21 -.-> P_21
    P_22["ᐳf…mᐳr…rᐳgravatarUrl"]
    PgClassExpression_22 -.-> P_22
    P_29["ᐳf…mᐳr…rᐳmostRecentForum"]
    PgSelectSingle_29 -.-> P_29
    P_38["ᐳf…mᐳr…rᐳm…mᐳuniqueAuthorCount"]
    PgClassExpression_38 -.-> P_38
    P_40["ᐳf…mᐳr…rᐳm…mᐳfeaturedMessages"]
    PgSelect_40 -.-> P_40
    P_45["ᐳf…mᐳr…rᐳm…mᐳfeaturedMessages[]"]
    PgSelectSingle_45 -.-> P_45
    P_46["ᐳf…mᐳr…rᐳm…mᐳf…]ᐳbody"]
    PgClassExpression_46 -.-> P_46

    subgraph "Buckets for queries/functions/computed-column-combined"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀forum ᐸ-O- _13<br />⠀⠀⠀forum.randomUser ᐸ-O- _20<br />⠀⠀⠀⠀forum.randomUser.username ᐸ-L- _21<br />⠀⠀⠀⠀forum.randomUser.gravatarUrl ᐸ-L- _22<br />⠀⠀⠀⠀forum.randomUser.mostRecentForum ᐸ-O- _29<br />⠀⠀⠀⠀⠀forum.randomUser.mostRecentForum.uniqueAuthorCount ᐸ-L- _38<br />⠀⠀⠀⠀⠀forum.randomUser.mostRecentForum.featuredMessages ᐸ-A- _40"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,InputStaticLeaf_7,PgSelect_8,First_12,PgSelectSingle_13,PgClassExpression_14,PgSelect_15,First_19,PgSelectSingle_20,PgClassExpression_21,PgClassExpression_22,PgClassExpression_23,PgSelect_24,First_28,PgSelectSingle_29,InputStaticLeaf_30,PgClassExpression_31,PgSelectSingle_37,PgClassExpression_38,PgSelect_40,Access_41,Access_42,Object_43,Map_47 bucket0
    Bucket1("Bucket 1 (item_44)<br />Deps: _40<br />~ᐳQuery.forumᐳForum.randomUserᐳUser.mostRecentForumᐳForum.featuredMessages[]<br />⠀ROOT ᐸ-O- _45<br />⠀⠀body ᐸ-L- _46"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_44,PgSelectSingle_45,PgClassExpression_46 bucket1
    Bucket0 --> Bucket1
    end
```
