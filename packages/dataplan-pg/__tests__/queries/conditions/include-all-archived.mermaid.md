```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000

    %% subgraph fields
    P1{{"~"}}:::path
    P2[/">forums"\]:::path
    P3>">forums[]"]:::path
    P2 -.- P3
    P4([">fo…s[]>name"]):::path
    %% P3 -.-> P4
    P5[/">fo…s[]>messagesList"\]:::path
    P6>">fo…s[]>messagesList[]"]:::path
    P5 -.- P6
    P7([">fo…s[]>me…t[]>body"]):::path
    %% P6 -.-> P7
    P8{{">fo…s[]>me…t[]>author"}}:::path
    P9([">fo…s[]>me…t[]>author>username"]):::path
    %% P8 -.-> P9
    P10([">fo…s[]>me…t[]>author>gravatarUrl"]):::path
    %% P8 -.-> P10
    %% P6 -.-> P8
    %% P3 -.-> P5
    %% P1 -.-> P2
    %% end

    %% define plans
    __Value_3["__Value[_3∈0]<br /><context>"]:::plan
    __Value_5["__Value[_5∈0]<br /><rootValue>"]:::plan
    PgSelect_17[["PgSelect[_17∈0]<br /><forums>"]]:::plan
    __Item_21>"__Item[_21∈1]<br /><_17>"]:::itemplan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br /><forums>"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br /><__forums__.#quot;name#quot;>"]:::plan
    __Item_37>"__Item[_37∈2]<br /><_51>"]:::itemplan
    PgSelectSingle_38["PgSelectSingle[_38∈2]<br /><messages>"]:::plan
    PgClassExpression_39["PgClassExpression[_39∈2]<br /><__messages__.#quot;body#quot;>"]:::plan
    Access_42["Access[_42∈0]<br /><_3.pgSettings>"]:::plan
    Access_43["Access[_43∈0]<br /><_3.withPgClient>"]:::plan
    Object_44["Object[_44∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    First_45["First[_45∈2]"]:::plan
    PgSelectSingle_46["PgSelectSingle[_46∈2]<br /><users>"]:::plan
    PgClassExpression_47["PgClassExpression[_47∈2]<br /><__users__.#quot;username#quot;>"]:::plan
    PgClassExpression_48["PgClassExpression[_48∈2]<br /><__users__....vatar_url#quot;>"]:::plan
    Map_49["Map[_49∈2]<br /><_38:{#quot;0#quot;:1,#quot;1#quot;:2}>"]:::plan
    List_50["List[_50∈2]<br /><_49>"]:::plan
    Access_51["Access[_51∈1]<br /><_21.1>"]:::plan

    %% plan dependencies
    Object_44 --> PgSelect_17
    PgSelect_17 ==> __Item_21
    __Item_21 --> PgSelectSingle_22
    PgSelectSingle_22 --> PgClassExpression_23
    Access_51 ==> __Item_37
    __Item_37 --> PgSelectSingle_38
    PgSelectSingle_38 --> PgClassExpression_39
    __Value_3 --> Access_42
    __Value_3 --> Access_43
    Access_42 --> Object_44
    Access_43 --> Object_44
    List_50 --> First_45
    First_45 --> PgSelectSingle_46
    PgSelectSingle_46 --> PgClassExpression_47
    PgSelectSingle_46 --> PgClassExpression_48
    PgSelectSingle_38 --> Map_49
    Map_49 --> List_50
    __Item_21 --> Access_51

    %% plan-to-path relationships
    __Value_5 -.-> P1
    PgSelect_17 -.-> P2
    PgSelectSingle_22 -.-> P3
    PgClassExpression_23 -.-> P4
    Access_51 -.-> P5
    PgSelectSingle_38 -.-> P6
    PgClassExpression_39 -.-> P7
    PgSelectSingle_46 -.-> P8
    PgClassExpression_47 -.-> P9
    PgClassExpression_48 -.-> P10

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,PgSelect_17,Access_42,Access_43,Object_44 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Item_21,PgSelectSingle_22,PgClassExpression_23,Access_51 bucket1
    classDef bucket2 stroke:#808000
    class __Item_37,PgSelectSingle_38,PgClassExpression_39,First_45,PgSelectSingle_46,PgClassExpression_47,PgClassExpression_48,Map_49,List_50 bucket2
```
