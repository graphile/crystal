```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    __Item_14>"__Item[_14∈2]<br />ᐸ_13ᐳ"]:::itemplan
    PgClassExpression_13["PgClassExpression[_13∈1]<br />ᐸ__forum_na...es_cases__ᐳ"]:::plan
    PgSelectSingle_12["PgSelectSingle[_12∈1]<br />ᐸforum_names_casesᐳ"]:::plan
    __Item_11>"__Item[_11∈1]<br />ᐸ_7ᐳ"]:::itemplan
    PgSelect_7[["PgSelect[_7∈0]<br />ᐸforum_names_casesᐳ"]]:::plan
    Object_10["Object[_10∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_8["Access[_8∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_9["Access[_9∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan

    %% plan dependencies
    PgClassExpression_13 ==> __Item_14
    PgSelectSingle_12 --> PgClassExpression_13
    __Item_11 --> PgSelectSingle_12
    PgSelect_7 ==> __Item_11
    Object_10 --> PgSelect_7
    Access_8 & Access_9 --> Object_10
    __Value_3 --> Access_8
    __Value_3 --> Access_9

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_7["ᐳforumNamesCasesList"]
    PgSelect_7 -.-> P_7
    P_13["ᐳforumNamesCasesList[]"]
    PgClassExpression_13 -.-> P_13
    P_14["ᐳforumNamesCasesList[][]"]
    __Item_14 -.-> P_14

    subgraph "Buckets for queries/functions/custom-query-forum-names-cases"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀forumNamesCasesList ᐸ-A- _7"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,PgSelect_7,Access_8,Access_9,Object_10 bucket0
    Bucket1("Bucket 1 (item_11)<br />Deps: _7<br />~ᐳQuery.forumNamesCasesList[]<br />⠀ROOT ᐸ-A- _13"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_11,PgSelectSingle_12,PgClassExpression_13 bucket1
    Bucket2("Bucket 2 (item_14)<br />Deps: _13<br />~ᐳQuery.forumNamesCasesList[][]<br />⠀ROOT ᐸ-L- _14"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item_14 bucket2
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2
    end
```
