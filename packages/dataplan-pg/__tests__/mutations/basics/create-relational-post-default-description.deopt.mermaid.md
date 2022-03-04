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
    InputStaticLeaf_10["InputStaticLeaf[_10∈1@1]"]:::plan
    Constant_11["Constant[_11∈1@1]"]:::plan
    Constant_12["Constant[_12∈1@1]"]:::plan
    PgInsert_13[["PgInsert[_13∈1@1]"]]:::sideeffectplan
    PgClassExpression_17["PgClassExpression[_17∈1@1]<br />ᐸ__relation...ems__.”id”ᐳ"]:::plan
    PgInsert_18[["PgInsert[_18∈1@1]"]]:::sideeffectplan
    PgClassExpression_22["PgClassExpression[_22∈1@1]<br />ᐸ__relational_posts__ᐳ"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1@1]<br />ᐸ(__relatio...ts__).”id”ᐳ"]:::plan
    PgSelect_25[["PgSelect[_25∈1@1]<br />ᐸrelational_postsᐳ"]]:::plan
    Access_26["Access[_26∈1@1]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_27["Access[_27∈1@1]<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_28["Object[_28∈1@1]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    First_29["First[_29∈1@1]"]:::plan
    PgSelectSingle_30["PgSelectSingle[_30∈1@1]<br />ᐸrelational_postsᐳ"]:::plan
    PgClassExpression_31["PgClassExpression[_31∈1@1]<br />ᐸ__relation...sts__.”id”ᐳ"]:::plan
    PgClassExpression_32["PgClassExpression[_32∈1@1]<br />ᐸ__relation...__.”title”ᐳ"]:::plan
    PgClassExpression_33["PgClassExpression[_33∈1@1]<br />ᐸ__relation...scription”ᐳ"]:::plan
    PgClassExpression_34["PgClassExpression[_34∈1@1]<br />ᐸ__relation...s__.”note”ᐳ"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_28 & Constant_11 & Constant_12 --> PgInsert_13
    PgInsert_13 --> PgClassExpression_17
    Object_28 & PgClassExpression_17 & InputStaticLeaf_8 & InputStaticLeaf_10 --> PgInsert_18
    PgInsert_18 --> PgClassExpression_22
    PgInsert_18 --> PgClassExpression_23
    Object_28 & PgClassExpression_23 --> PgSelect_25
    __Value_3 --> Access_26
    __Value_3 --> Access_27
    Access_26 & Access_27 --> Object_28
    PgSelect_25 --> First_29
    First_29 --> PgSelectSingle_30
    PgSelectSingle_30 --> PgClassExpression_31
    PgSelectSingle_30 --> PgClassExpression_32
    PgSelectSingle_30 --> PgClassExpression_33
    PgSelectSingle_30 --> PgClassExpression_34

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_22["ᐳcreateRelationalPost"]
    PgClassExpression_22 -.-> P_22
    P_23["ᐳc…tᐳid"]
    PgClassExpression_23 -.-> P_23
    P_30["ᐳc…tᐳpost"]
    PgSelectSingle_30 -.-> P_30
    P_31["ᐳc…tᐳpostᐳid"]
    PgClassExpression_31 -.-> P_31
    P_32["ᐳc…tᐳpostᐳtitle"]
    PgClassExpression_32 -.-> P_32
    P_33["ᐳc…tᐳpostᐳdescription"]
    PgClassExpression_33 -.-> P_33
    P_34["ᐳc…tᐳpostᐳnote"]
    PgClassExpression_34 -.-> P_34

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,__Value_5,__TrackedObject_6 bucket0
    classDef bucket1 stroke:#00bfff
    class InputStaticLeaf_8,InputStaticLeaf_10,Constant_11,Constant_12,PgInsert_13,PgClassExpression_17,PgInsert_18,PgClassExpression_22,PgClassExpression_23,PgSelect_25,Access_26,Access_27,Object_28,First_29,PgSelectSingle_30,PgClassExpression_31,PgClassExpression_32,PgClassExpression_33,PgClassExpression_34 bucket1

    subgraph "Buckets for mutations/basics/create-relational-post-default-description"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (group1[mutation])<br />Deps: _3<br />~ᐳMutation.createRelationalPost<br />⠀ROOT ᐸ-O- _22<br />⠀⠀id ᐸ-L- _23<br />⠀⠀post ᐸ-O- _30<br />⠀⠀⠀post.id ᐸ-L- _31<br />⠀⠀⠀post.title ᐸ-L- _32<br />⠀⠀⠀post.description ᐸ-L- _33<br />⠀⠀⠀post.note ᐸ-L- _34"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    end
```
