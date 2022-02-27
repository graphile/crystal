```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    __Value_3["__Value[_3∈0]<br /><context>"]:::plan
    PgSelect_17[["PgSelect[_17∈0]<br /><forums>"]]:::plan
    __Item_21>"__Item[_21∈1]<br /><_17>"]:::itemplan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br /><forums>"]:::plan
    InputStaticLeaf_23["InputStaticLeaf[_23∈0]"]:::plan
    InputStaticLeaf_24["InputStaticLeaf[_24∈0]"]:::plan
    InputStaticLeaf_26["InputStaticLeaf[_26∈0]"]:::plan
    PgClassExpression_32["PgClassExpression[_32∈1]<br /><__forums__.”id”>"]:::plan
    Access_34["Access[_34∈0]<br /><_3.pgSettings>"]:::plan
    Access_35["Access[_35∈0]<br /><_3.withPgClient>"]:::plan
    Object_36["Object[_36∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    Connection_37["Connection[_37∈0]<br /><_33>"]:::plan
    PgClassExpression_38["PgClassExpression[_38∈1]<br /><__forums__...chived_at”>"]:::plan
    PgPageInfo_39["PgPageInfo[_39∈0]"]:::plan
    PgSelect_40[["PgSelect[_40∈1]<br /><messages>"]]:::plan
    Lambda_41["Lambda[_41∈1]<br /><listHasMore>"]:::plan
    PgSelect_42[["PgSelect[_42∈1]<br /><messages>"]]:::plan
    First_43["First[_43∈1]"]:::plan
    PgSelectSingle_44["PgSelectSingle[_44∈1]<br /><messages>"]:::plan
    PgClassExpression_45["PgClassExpression[_45∈1]<br /><count(*)>"]:::plan

    %% plan dependencies
    Object_36 --> PgSelect_17
    PgSelect_17 ==> __Item_21
    __Item_21 --> PgSelectSingle_22
    PgSelectSingle_22 --> PgClassExpression_32
    __Value_3 --> Access_34
    __Value_3 --> Access_35
    Access_34 --> Object_36
    Access_35 --> Object_36
    InputStaticLeaf_23 --> Connection_37
    InputStaticLeaf_24 --> Connection_37
    PgSelectSingle_22 --> PgClassExpression_38
    Object_36 --> PgSelect_40
    PgClassExpression_32 --> PgSelect_40
    InputStaticLeaf_26 --> PgSelect_40
    PgClassExpression_38 --> PgSelect_40
    PgSelect_40 --> Lambda_41
    Object_36 --> PgSelect_42
    PgClassExpression_32 --> PgSelect_42
    InputStaticLeaf_26 --> PgSelect_42
    PgClassExpression_38 --> PgSelect_42
    PgSelect_42 --> First_43
    First_43 --> PgSelectSingle_44
    PgSelectSingle_44 --> PgClassExpression_45

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_17[">forums"]
    PgSelect_17 -.-> P_17
    P_22[">forums[]"]
    PgSelectSingle_22 -.-> P_22
    P_37[">f…]>messagesConnection"]
    Connection_37 -.-> P_37
    P_39[">f…]>m…n>pageInfo"]
    PgPageInfo_39 -.-> P_39
    P_41[">f…]>m…n>p…o>hasNextPage"]
    Lambda_41 -.-> P_41
    P_45[">f…]>m…n>totalCount"]
    PgClassExpression_45 -.-> P_45

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,PgSelect_17,InputStaticLeaf_23,InputStaticLeaf_24,InputStaticLeaf_26,Access_34,Access_35,Object_36,Connection_37,PgPageInfo_39 bucket0
    classDef bucket1 stroke:#00bfff
    class __Item_21,PgSelectSingle_22,PgClassExpression_32,PgClassExpression_38,PgSelect_40,Lambda_41,PgSelect_42,First_43,PgSelectSingle_44,PgClassExpression_45 bucket1

    subgraph "Buckets for queries/conditions/condition-featured-messages-minimal"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT <-O- _0<br />⠀⠀forums <-A- _17"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_21)<br />~>Query.forums[]<br />⠀ROOT <-O- _22<br />⠀⠀messagesConnection <-O- _37<br />⠀⠀⠀messagesConnection.pageInfo <-O- _39<br />⠀⠀⠀⠀messagesConnection.pageInfo.hasNextPage <-L- _41<br />⠀⠀⠀messagesConnection.totalCount <-L- _45"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    end
```
