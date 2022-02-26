```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_3["__Value[_3∈0]<br /><context>"]:::plan
    __Value_5["__Value[_5∈0]<br /><rootValue>"]:::plan
    __TrackedObject_6["__TrackedObject[_6∈0]"]:::plan
    InputStaticLeaf_14["InputStaticLeaf[_14∈0]"]:::plan
    InputStaticLeaf_15["InputStaticLeaf[_15∈0]"]:::plan
    InputStaticLeaf_16["InputStaticLeaf[_16∈0]"]:::plan
    InputStaticLeaf_17["InputStaticLeaf[_17∈0]"]:::plan
    Connection_26["Connection[_26∈0]<br /><_22>"]:::plan
    PgSelect_27[["PgSelect[_27∈0]<br /><messages>"]]:::plan
    __Item_28>"__Item[_28∈1]<br /><_27>"]:::itemplan
    PgSelectSingle_29["PgSelectSingle[_29∈1]<br /><messages>"]:::plan
    PgCursor_30["PgCursor[_30∈1]"]:::plan
    PgClassExpression_31["PgClassExpression[_31∈1]<br /><__author__.username>"]:::plan
    PgClassExpression_32["PgClassExpression[_32∈1]<br /><__messages__.body>"]:::plan
    PgClassExpression_33["PgClassExpression[_33∈1]<br /><__messages__.”id”>"]:::plan
    List_34["List[_34∈1]<br /><_31,_32,_33>"]:::plan
    PgClassExpression_35["PgClassExpression[_35∈1]<br /><__messages__.”body”>"]:::plan
    PgClassExpression_36["PgClassExpression[_36∈1]<br /><__messages...author_id”>"]:::plan
    PgSelect_37[["PgSelect[_37∈1]<br /><users>"]]:::plan
    Access_38["Access[_38∈0]<br /><_3.pgSettings>"]:::plan
    Access_39["Access[_39∈0]<br /><_3.withPgClient>"]:::plan
    Object_40["Object[_40∈0]<br /><{pgSettings,withPgClient}>"]:::plan
    First_41["First[_41∈1]"]:::plan
    PgSelectSingle_42["PgSelectSingle[_42∈1]<br /><users>"]:::plan
    PgClassExpression_43["PgClassExpression[_43∈1]<br /><__users__.”username”>"]:::plan
    PgClassExpression_44["PgClassExpression[_44∈1]<br /><__users__....vatar_url”>"]:::plan
    PgPageInfo_45["PgPageInfo[_45∈0]"]:::plan
    Lambda_47["Lambda[_47∈0]<br /><listHasMore>"]:::plan
    Constant_48["Constant[_48∈0]"]:::plan
    First_50["First[_50∈0]"]:::plan
    PgSelectSingle_51["PgSelectSingle[_51∈0]<br /><messages>"]:::plan
    PgCursor_52["PgCursor[_52∈0]"]:::plan
    PgClassExpression_53["PgClassExpression[_53∈0]<br /><__author__.username>"]:::plan
    PgClassExpression_54["PgClassExpression[_54∈0]<br /><__messages__.body>"]:::plan
    PgClassExpression_55["PgClassExpression[_55∈0]<br /><__messages__.”id”>"]:::plan
    List_56["List[_56∈0]<br /><_53,_54,_55>"]:::plan
    Last_58["Last[_58∈0]"]:::plan
    PgSelectSingle_59["PgSelectSingle[_59∈0]<br /><messages>"]:::plan
    PgCursor_60["PgCursor[_60∈0]"]:::plan
    PgClassExpression_61["PgClassExpression[_61∈0]<br /><__author__.username>"]:::plan
    PgClassExpression_62["PgClassExpression[_62∈0]<br /><__messages__.body>"]:::plan
    PgClassExpression_63["PgClassExpression[_63∈0]<br /><__messages__.”id”>"]:::plan
    List_64["List[_64∈0]<br /><_61,_62,_63>"]:::plan
    PgSelect_65[["PgSelect[_65∈0]<br /><messages>"]]:::plan
    First_66["First[_66∈0]"]:::plan
    PgSelectSingle_67["PgSelectSingle[_67∈0]<br /><messages>"]:::plan
    PgClassExpression_68["PgClassExpression[_68∈0]<br /><count(*)>"]:::plan

    %% plan dependencies
    __Value_5 --> __TrackedObject_6
    InputStaticLeaf_14 --> Connection_26
    InputStaticLeaf_15 --> Connection_26
    InputStaticLeaf_16 --> Connection_26
    InputStaticLeaf_17 --> Connection_26
    Object_40 --> PgSelect_27
    PgSelect_27 ==> __Item_28
    __Item_28 --> PgSelectSingle_29
    List_34 --> PgCursor_30
    PgSelectSingle_29 --> PgClassExpression_31
    PgSelectSingle_29 --> PgClassExpression_32
    PgSelectSingle_29 --> PgClassExpression_33
    PgClassExpression_31 --> List_34
    PgClassExpression_32 --> List_34
    PgClassExpression_33 --> List_34
    PgSelectSingle_29 --> PgClassExpression_35
    PgSelectSingle_29 --> PgClassExpression_36
    Object_40 --> PgSelect_37
    PgClassExpression_36 --> PgSelect_37
    __Value_3 --> Access_38
    __Value_3 --> Access_39
    Access_38 --> Object_40
    Access_39 --> Object_40
    PgSelect_37 --> First_41
    First_41 --> PgSelectSingle_42
    PgSelectSingle_42 --> PgClassExpression_43
    PgSelectSingle_42 --> PgClassExpression_44
    PgSelect_27 --> Lambda_47
    PgSelect_27 --> First_50
    First_50 --> PgSelectSingle_51
    List_56 --> PgCursor_52
    PgSelectSingle_51 --> PgClassExpression_53
    PgSelectSingle_51 --> PgClassExpression_54
    PgSelectSingle_51 --> PgClassExpression_55
    PgClassExpression_53 --> List_56
    PgClassExpression_54 --> List_56
    PgClassExpression_55 --> List_56
    PgSelect_27 --> Last_58
    Last_58 --> PgSelectSingle_59
    List_64 --> PgCursor_60
    PgSelectSingle_59 --> PgClassExpression_61
    PgSelectSingle_59 --> PgClassExpression_62
    PgSelectSingle_59 --> PgClassExpression_63
    PgClassExpression_61 --> List_64
    PgClassExpression_62 --> List_64
    PgClassExpression_63 --> List_64
    Object_40 --> PgSelect_65
    PgSelect_65 --> First_66
    First_66 --> PgSelectSingle_67
    PgSelectSingle_67 --> PgClassExpression_68

    %% plan-to-path relationships
    P_6["~"]
    __TrackedObject_6 -.-> P_6
    P_26[">allMessagesConnection"]
    Connection_26 -.-> P_26
    P_27[">a…n>edges"]
    PgSelect_27 -.-> P_27
    P_29[">a…n>edges[]<br />>a…n>e…]>node"]
    PgSelectSingle_29 -.-> P_29
    P_30[">a…n>e…]>cursor"]
    PgCursor_30 -.-> P_30
    P_35[">a…n>e…]>node>body"]
    PgClassExpression_35 -.-> P_35
    P_42[">a…n>e…]>node>author"]
    PgSelectSingle_42 -.-> P_42
    P_43[">a…n>e…]>node>a…r>username"]
    PgClassExpression_43 -.-> P_43
    P_44[">a…n>e…]>node>a…r>gravatarUrl"]
    PgClassExpression_44 -.-> P_44
    P_45[">a…n>pageInfo"]
    PgPageInfo_45 -.-> P_45
    P_47[">a…n>p…o>hasNextPage"]
    Lambda_47 -.-> P_47
    P_48[">a…n>p…o>hasPreviousPage"]
    Constant_48 -.-> P_48
    P_52[">a…n>p…o>startCursor"]
    PgCursor_52 -.-> P_52
    P_60[">a…n>p…o>endCursor"]
    PgCursor_60 -.-> P_60
    P_68[">a…n>totalCount"]
    PgClassExpression_68 -.-> P_68

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,__TrackedObject_6,InputStaticLeaf_14,InputStaticLeaf_15,InputStaticLeaf_16,InputStaticLeaf_17,Connection_26,PgSelect_27,Access_38,Access_39,Object_40,PgPageInfo_45,Lambda_47,Constant_48,First_50,PgSelectSingle_51,PgCursor_52,PgClassExpression_53,PgClassExpression_54,PgClassExpression_55,List_56,Last_58,PgSelectSingle_59,PgCursor_60,PgClassExpression_61,PgClassExpression_62,PgClassExpression_63,List_64,PgSelect_65,First_66,PgSelectSingle_67,PgClassExpression_68 bucket0
    classDef bucket1 stroke:#00bfff
    class __Item_28,PgSelectSingle_29,PgCursor_30,PgClassExpression_31,PgClassExpression_32,PgClassExpression_33,List_34,PgClassExpression_35,PgClassExpression_36,PgSelect_37,First_41,PgSelectSingle_42,PgClassExpression_43,PgClassExpression_44 bucket1

    subgraph Buckets
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT <-O- _6<br />⠀⠀allMessagesConnection <-O- _26<br />⠀⠀⠀allMessagesConnection.edges <-A- _27<br />⠀⠀⠀allMessagesConnection.pageInfo <-O- _45<br />⠀⠀⠀⠀allMessagesConnection.pageInfo.hasNextPage <-L- _47<br />⠀⠀⠀⠀allMessagesConnection.pageInfo.hasPreviousPage <-L- _48<br />⠀⠀⠀⠀allMessagesConnection.pageInfo.startCursor <-L- _52<br />⠀⠀⠀⠀allMessagesConnection.pageInfo.endCursor <-L- _60<br />⠀⠀⠀allMessagesConnection.totalCount <-L- _68"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_28)<br />~>Query.allMessagesConnection>MessagesConnection.edges[]<br />⠀ROOT <-O- _29<br />⠀⠀node <-O- _29<br />⠀⠀⠀node.body <-L- _35<br />⠀⠀⠀node.author <-O- _42<br />⠀⠀⠀⠀node.author.username <-L- _43<br />⠀⠀⠀⠀node.author.gravatarUrl <-L- _44<br />⠀⠀cursor <-L- _30"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    end
```
