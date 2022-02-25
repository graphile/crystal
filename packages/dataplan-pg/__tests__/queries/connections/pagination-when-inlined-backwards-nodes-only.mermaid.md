```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px


    %% define plans
    __Value_3["__Value[_3∈0]<br /><context>"]:::plan
    __Value_5["__Value[_5∈0]<br /><rootValue>"]:::plan
    __TrackedObject_6["__TrackedObject[_6∈0]"]:::plan
    PgSelect_17[["PgSelect[_17∈0]<br /><forums>"]]:::plan
    __Item_21>"__Item[_21∈1]<br /><_17>"]:::itemplan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br /><forums>"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br /><__forums__.”name”>"]:::plan
    InputStaticLeaf_24["InputStaticLeaf[_24∈0]"]:::plan
    InputStaticLeaf_25["InputStaticLeaf[_25∈0]"]:::plan
    Connection_38["Connection[_38∈0]<br /><_34>"]:::plan
    __Item_40>"__Item[_40∈2]<br /><_75>"]:::itemplan
    PgSelectSingle_41["PgSelectSingle[_41∈2]<br /><messages>"]:::plan
    PgClassExpression_42["PgClassExpression[_42∈2]<br /><__messages__.”body”>"]:::plan
    Access_45["Access[_45∈0]<br /><_3.pgSettings>"]:::plan
    Access_46["Access[_46∈0]<br /><_3.withPgClient>"]:::plan
    Object_47["Object[_47∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    First_48["First[_48∈2]"]:::plan
    PgSelectSingle_49["PgSelectSingle[_49∈2]<br /><users>"]:::plan
    PgClassExpression_50["PgClassExpression[_50∈2]<br /><__users__.”username”>"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈2]<br /><__users__....vatar_url”>"]:::plan
    PgPageInfo_52["PgPageInfo[_52∈0]"]:::plan
    Constant_53["Constant[_53∈0]"]:::plan
    Lambda_55["Lambda[_55∈1]<br /><listHasMore>"]:::plan
    First_57["First[_57∈1]"]:::plan
    PgSelectSingle_58["PgSelectSingle[_58∈1]<br /><messages>"]:::plan
    PgCursor_59["PgCursor[_59∈1]"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈1]<br /><__messages__.”id”>"]:::plan
    List_61["List[_61∈1]<br /><_60>"]:::plan
    Last_63["Last[_63∈1]"]:::plan
    PgSelectSingle_64["PgSelectSingle[_64∈1]<br /><messages>"]:::plan
    PgCursor_65["PgCursor[_65∈1]"]:::plan
    PgClassExpression_66["PgClassExpression[_66∈1]<br /><__messages__.”id”>"]:::plan
    List_67["List[_67∈1]<br /><_66>"]:::plan
    First_69["First[_69∈1]"]:::plan
    PgSelectSingle_70["PgSelectSingle[_70∈1]<br /><messages>"]:::plan
    PgClassExpression_71["PgClassExpression[_71∈1]<br /><count(*)>"]:::plan
    Map_72["Map[_72∈2]<br /><_41:{”0”:1,”1”:2}>"]:::plan
    List_73["List[_73∈2]<br /><_72>"]:::plan
    Access_74["Access[_74∈1]<br /><_21.1>"]:::plan
    Lambda_75["Lambda[_75∈1]"]:::plan
    Access_76["Access[_76∈1]<br /><_21.2>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    Object_47 --> PgSelect_17
    PgSelect_17 ==> __Item_21
    __Item_21 --> PgSelectSingle_22
    PgSelectSingle_22 --> PgClassExpression_23
    InputStaticLeaf_24 --> Connection_38
    InputStaticLeaf_25 --> Connection_38
    Lambda_75 ==> __Item_40
    __Item_40 --> PgSelectSingle_41
    PgSelectSingle_41 --> PgClassExpression_42
    __Value_3 --> Access_45
    __Value_3 --> Access_46
    Access_45 --> Object_47
    Access_46 --> Object_47
    List_73 --> First_48
    First_48 --> PgSelectSingle_49
    PgSelectSingle_49 --> PgClassExpression_50
    PgSelectSingle_49 --> PgClassExpression_51
    Lambda_75 --> Lambda_55
    Lambda_75 --> First_57
    First_57 --> PgSelectSingle_58
    List_61 --> PgCursor_59
    PgSelectSingle_58 --> PgClassExpression_60
    PgClassExpression_60 --> List_61
    Lambda_75 --> Last_63
    Last_63 --> PgSelectSingle_64
    List_67 --> PgCursor_65
    PgSelectSingle_64 --> PgClassExpression_66
    PgClassExpression_66 --> List_67
    Access_76 --> First_69
    First_69 --> PgSelectSingle_70
    PgSelectSingle_70 --> PgClassExpression_71
    PgSelectSingle_41 --> Map_72
    Map_72 --> List_73
    __Item_21 --> Access_74
    Access_74 --> Lambda_75
    __Item_21 --> Access_76

    %% plan-to-path relationships
    P1["~"]
    __TrackedObject_6 -.-> P1
    P2[">forums"]
    PgSelect_17 -.-> P2
    P3[">forums[]"]
    PgSelectSingle_22 -.-> P3
    P4[">f…]>name"]
    PgClassExpression_23 -.-> P4
    P5[">f…]>messagesConnection"]
    Connection_38 -.-> P5
    P6[">f…]>m…n>nodes"]
    Lambda_75 -.-> P6
    P7[">f…]>m…n>nodes[]"]
    PgSelectSingle_41 -.-> P7
    P8[">f…]>m…n>n…]>body"]
    PgClassExpression_42 -.-> P8
    P9[">f…]>m…n>n…]>author"]
    PgSelectSingle_49 -.-> P9
    P10[">f…]>m…n>n…]>a…r>username"]
    PgClassExpression_50 -.-> P10
    P11[">f…]>m…n>n…]>a…r>gravatarUrl"]
    PgClassExpression_51 -.-> P11
    P12[">f…]>m…n>pageInfo"]
    PgPageInfo_52 -.-> P12
    P13[">f…]>m…n>p…o>hasNextPage"]
    Constant_53 -.-> P13
    P14[">f…]>m…n>p…o>hasPreviousPage"]
    Lambda_55 -.-> P14
    P15[">f…]>m…n>p…o>startCursor"]
    PgCursor_59 -.-> P15
    P16[">f…]>m…n>p…o>endCursor"]
    PgCursor_65 -.-> P16
    P17[">f…]>m…n>totalCount"]
    PgClassExpression_71 -.-> P17

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,PgSelect_17,InputStaticLeaf_24,InputStaticLeaf_25,Connection_38,Access_45,Access_46,Object_47,PgPageInfo_52,Constant_53 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Item_21,PgSelectSingle_22,PgClassExpression_23,Lambda_55,First_57,PgSelectSingle_58,PgCursor_59,PgClassExpression_60,List_61,Last_63,PgSelectSingle_64,PgCursor_65,PgClassExpression_66,List_67,First_69,PgSelectSingle_70,PgClassExpression_71,Access_74,Lambda_75,Access_76 bucket1
    classDef bucket2 stroke:#808000
    class __Item_40,PgSelectSingle_41,PgClassExpression_42,First_48,PgSelectSingle_49,PgClassExpression_50,PgClassExpression_51,Map_72,List_73 bucket2

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_21)<br />~>Query.forums[]"):::bucket
    style Bucket1 stroke:#a52a2a
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (item_40)<br />~>Query.forums[]>Forum.messagesConnection>MessagesConnection.nodes[]"):::bucket
    style Bucket2 stroke:#808000
    Bucket1 --> Bucket2
    end
```