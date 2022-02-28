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
    PgSelect_7[["PgSelect[_7∈0]<br />ᐸforum_names_arrayᐳ"]]:::plan
    Access_8["Access[_8∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_9["Access[_9∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_10["Object[_10∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    First_11["First[_11∈0]"]:::plan
    PgSelectSingle_12["PgSelectSingle[_12∈0]<br />ᐸforum_names_arrayᐳ"]:::plan
    PgClassExpression_13["PgClassExpression[_13∈0]<br />ᐸ__forum_na...es_array__ᐳ"]:::plan
    __Item_14>"__Item[_14∈1]<br />ᐸ_13ᐳ"]:::itemplan

    %% plan dependencies
    Object_10 --> PgSelect_7
    __Value_3 --> Access_8
    __Value_3 --> Access_9
    Access_8 --> Object_10
    Access_9 --> Object_10
    PgSelect_7 --> First_11
    First_11 --> PgSelectSingle_12
    PgSelectSingle_12 --> PgClassExpression_13
    PgClassExpression_13 ==> __Item_14

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_13["ᐳforumNamesArray"]
    PgClassExpression_13 -.-> P_13
    P_14["ᐳforumNamesArray[]"]
    __Item_14 -.-> P_14

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,PgSelect_7,Access_8,Access_9,Object_10,First_11,PgSelectSingle_12,PgClassExpression_13 bucket0
    classDef bucket1 stroke:#00bfff
    class __Item_14 bucket1

    subgraph "Buckets for queries/functions/custom-query-forum-names-array"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀forumNamesArray ᐸ-L- _13"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_14)<br />Deps: _13<br />~ᐳQuery.forumNamesArray[]<br />⠀ROOT ᐸ-O- _14"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    end
```
