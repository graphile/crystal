```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br />ᐸ__forums__.”name”ᐳ"]:::plan
    PgClassExpression_42["PgClassExpression[_42∈2]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression_50["PgClassExpression[_50∈2]<br />ᐸ__users__.”username”ᐳ"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈2]<br />ᐸ__users__....vatar_url”ᐳ"]:::plan
    PgSelectSingle_49["PgSelectSingle[_49∈2]<br />ᐸusersᐳ"]:::plan
    First_48["First[_48∈2]"]:::plan
    PgSelect_44[["PgSelect[_44∈2]<br />ᐸusersᐳ"]]:::plan
    PgClassExpression_43["PgClassExpression[_43∈2]<br />ᐸ__messages...author_id”ᐳ"]:::plan
    PgSelectSingle_41["PgSelectSingle[_41∈2]<br />ᐸmessagesᐳ"]:::plan
    __Item_40>"__Item[_40∈2]<br />ᐸ_39ᐳ"]:::itemplan
    Lambda_55["Lambda[_55∈1]<br />ᐸlistHasMoreᐳ"]:::plan
    PgCursor_59["PgCursor[_59∈1]"]:::plan
    List_61["List[_61∈1]<br />ᐸ_60ᐳ"]:::plan
    PgClassExpression_60["PgClassExpression[_60∈1]<br />ᐸ__messages__.”id”ᐳ"]:::plan
    PgSelectSingle_58["PgSelectSingle[_58∈1]<br />ᐸmessagesᐳ"]:::plan
    First_57["First[_57∈1]"]:::plan
    PgCursor_65["PgCursor[_65∈1]"]:::plan
    List_67["List[_67∈1]<br />ᐸ_66ᐳ"]:::plan
    PgClassExpression_66["PgClassExpression[_66∈1]<br />ᐸ__messages__.”id”ᐳ"]:::plan
    PgSelectSingle_64["PgSelectSingle[_64∈1]<br />ᐸmessagesᐳ"]:::plan
    Last_63["Last[_63∈1]"]:::plan
    PgSelect_39[["PgSelect[_39∈1]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression_71["PgClassExpression[_71∈1]<br />ᐸcount(*)ᐳ"]:::plan
    PgSelectSingle_70["PgSelectSingle[_70∈1]<br />ᐸmessagesᐳ"]:::plan
    First_69["First[_69∈1]"]:::plan
    PgSelect_68[["PgSelect[_68∈1]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression_33["PgClassExpression[_33∈1]<br />ᐸ__forums__.”id”ᐳ"]:::plan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br />ᐸforumsᐳ"]:::plan
    __Item_21>"__Item[_21∈1]<br />ᐸ_17ᐳ"]:::itemplan
    PgSelect_17[["PgSelect[_17∈0]<br />ᐸforumsᐳ"]]:::plan
    Object_47["Object[_47∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_45["Access[_45∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_46["Access[_46∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan
    Constant_72["Constant[_72∈0]"]:::plan
    PgPageInfo_52["PgPageInfo[_52∈0]"]:::plan
    Constant_53["Constant[_53∈0]"]:::plan

    %% plan dependencies
    PgSelectSingle_22 --> PgClassExpression_23
    PgSelectSingle_41 --> PgClassExpression_42
    PgSelectSingle_49 --> PgClassExpression_50
    PgSelectSingle_49 --> PgClassExpression_51
    First_48 --> PgSelectSingle_49
    PgSelect_44 --> First_48
    Object_47 & PgClassExpression_43 --> PgSelect_44
    PgSelectSingle_41 --> PgClassExpression_43
    __Item_40 --> PgSelectSingle_41
    PgSelect_39 ==> __Item_40
    PgSelect_39 --> Lambda_55
    List_61 --> PgCursor_59
    PgClassExpression_60 --> List_61
    PgSelectSingle_58 --> PgClassExpression_60
    First_57 --> PgSelectSingle_58
    PgSelect_39 --> First_57
    List_67 --> PgCursor_65
    PgClassExpression_66 --> List_67
    PgSelectSingle_64 --> PgClassExpression_66
    Last_63 --> PgSelectSingle_64
    PgSelect_39 --> Last_63
    Object_47 & PgClassExpression_33 --> PgSelect_39
    PgSelectSingle_70 --> PgClassExpression_71
    First_69 --> PgSelectSingle_70
    PgSelect_68 --> First_69
    Object_47 & PgClassExpression_33 --> PgSelect_68
    PgSelectSingle_22 --> PgClassExpression_33
    __Item_21 --> PgSelectSingle_22
    PgSelect_17 ==> __Item_21
    Object_47 --> PgSelect_17
    Access_45 & Access_46 --> Object_47
    __Value_3 --> Access_45
    __Value_3 --> Access_46

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_17["ᐳforums"]
    PgSelect_17 -.-> P_17
    P_22["ᐳforums[]"]
    PgSelectSingle_22 -.-> P_22
    P_23["ᐳf…]ᐳname"]
    PgClassExpression_23 -.-> P_23
    P_39["ᐳf…]ᐳm…nᐳnodes"]
    PgSelect_39 -.-> P_39
    P_41["ᐳf…]ᐳm…nᐳnodes[]"]
    PgSelectSingle_41 -.-> P_41
    P_42["ᐳf…]ᐳm…nᐳn…]ᐳbody"]
    PgClassExpression_42 -.-> P_42
    P_49["ᐳf…]ᐳm…nᐳn…]ᐳauthor"]
    PgSelectSingle_49 -.-> P_49
    P_50["ᐳf…]ᐳm…nᐳn…]ᐳa…rᐳusername"]
    PgClassExpression_50 -.-> P_50
    P_51["ᐳf…]ᐳm…nᐳn…]ᐳa…rᐳgravatarUrl"]
    PgClassExpression_51 -.-> P_51
    P_52["ᐳf…]ᐳm…nᐳpageInfo"]
    PgPageInfo_52 -.-> P_52
    P_53["ᐳf…]ᐳm…nᐳp…oᐳhasNextPage"]
    Constant_53 -.-> P_53
    P_55["ᐳf…]ᐳm…nᐳp…oᐳhasPreviousPage"]
    Lambda_55 -.-> P_55
    P_59["ᐳf…]ᐳm…nᐳp…oᐳstartCursor"]
    PgCursor_59 -.-> P_59
    P_65["ᐳf…]ᐳm…nᐳp…oᐳendCursor"]
    PgCursor_65 -.-> P_65
    P_71["ᐳf…]ᐳm…nᐳtotalCount"]
    PgClassExpression_71 -.-> P_71
    P_72["ᐳf…]ᐳmessagesConnection"]
    Constant_72 -.-> P_72

    subgraph "Buckets for queries/connections/pagination-when-inlined-backwards-nodes-only"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀forums ᐸ-A- _17"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,PgSelect_17,Access_45,Access_46,Object_47,PgPageInfo_52,Constant_53,Constant_72 bucket0
    Bucket1("Bucket 1 (item_21)<br />Deps: _17, _47, _72, _52, _53<br />~ᐳQuery.forums[]<br />⠀ROOT ᐸ-O- _22<br />⠀⠀name ᐸ-L- _23<br />⠀⠀messagesConnection ᐸ-O- _72<br />⠀⠀⠀messagesConnection.nodes ᐸ-A- _39<br />⠀⠀⠀messagesConnection.pageInfo ᐸ-O- _52<br />⠀⠀⠀⠀messagesConnection.pageInfo.hasNextPage ᐸ-L- _53<br />⠀⠀⠀⠀messagesConnection.pageInfo.hasPreviousPage ᐸ-L- _55<br />⠀⠀⠀⠀messagesConnection.pageInfo.startCursor ᐸ-L- _59<br />⠀⠀⠀⠀messagesConnection.pageInfo.endCursor ᐸ-L- _65<br />⠀⠀⠀messagesConnection.totalCount ᐸ-L- _71"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_21,PgSelectSingle_22,PgClassExpression_23,PgClassExpression_33,PgSelect_39,Lambda_55,First_57,PgSelectSingle_58,PgCursor_59,PgClassExpression_60,List_61,Last_63,PgSelectSingle_64,PgCursor_65,PgClassExpression_66,List_67,PgSelect_68,First_69,PgSelectSingle_70,PgClassExpression_71 bucket1
    Bucket2("Bucket 2 (item_40)<br />Deps: _39, _47<br />~ᐳQuery.forums[]ᐳForum.messagesConnectionᐳMessagesConnection.nodes[]<br />⠀ROOT ᐸ-O- _41<br />⠀⠀body ᐸ-L- _42<br />⠀⠀author ᐸ-O- _49<br />⠀⠀⠀author.username ᐸ-L- _50<br />⠀⠀⠀author.gravatarUrl ᐸ-L- _51"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item_40,PgSelectSingle_41,PgClassExpression_42,PgClassExpression_43,PgSelect_44,First_48,PgSelectSingle_49,PgClassExpression_50,PgClassExpression_51 bucket2
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2
    end
```
