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
    PgClassExpression_43["PgClassExpression[_43∈3@1]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈3@1]<br />ᐸ__users__.”username”ᐳ"]:::plan
    PgClassExpression_52["PgClassExpression[_52∈3@1]<br />ᐸ__users__....vatar_url”ᐳ"]:::plan
    PgSelectSingle_50["PgSelectSingle[_50∈3@1]<br />ᐸusersᐳ"]:::plan
    First_49["First[_49∈3@1]"]:::plan
    PgSelect_45[["PgSelect[_45∈3@1]<br />ᐸusersᐳ"]]:::plan
    PgClassExpression_44["PgClassExpression[_44∈3@1]<br />ᐸ__messages...author_id”ᐳ"]:::plan
    PgSelectSingle_42["PgSelectSingle[_42∈3@1]<br />ᐸmessagesᐳ"]:::plan
    __Item_41>"__Item[_41∈3@1]<br />ᐸ_40ᐳ"]:::itemplan
    PgSelect_40[["PgSelect[_40∈2@1]<br />ᐸmessagesᐳ"]]:::plan
    PgCursor_56["PgCursor[_56∈5@2]"]:::plan
    List_58["List[_58∈5@2]<br />ᐸ_57ᐳ"]:::plan
    PgClassExpression_57["PgClassExpression[_57∈5@2]<br />ᐸ__messages__.”id”ᐳ"]:::plan
    PgClassExpression_59["PgClassExpression[_59∈5@2]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression_67["PgClassExpression[_67∈5@2]<br />ᐸ__users__.”username”ᐳ"]:::plan
    PgClassExpression_68["PgClassExpression[_68∈5@2]<br />ᐸ__users__....vatar_url”ᐳ"]:::plan
    PgSelectSingle_66["PgSelectSingle[_66∈5@2]<br />ᐸusersᐳ"]:::plan
    First_65["First[_65∈5@2]"]:::plan
    PgSelect_61[["PgSelect[_61∈5@2]<br />ᐸusersᐳ"]]:::plan
    PgClassExpression_60["PgClassExpression[_60∈5@2]<br />ᐸ__messages...author_id”ᐳ"]:::plan
    PgSelectSingle_55["PgSelectSingle[_55∈5@2]<br />ᐸmessagesᐳ"]:::plan
    __Item_54>"__Item[_54∈5@2]<br />ᐸ_53ᐳ"]:::itemplan
    PgSelect_53[["PgSelect[_53∈4@2]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression_75["PgClassExpression[_75∈1]<br />ᐸcount(*)ᐳ"]:::plan
    PgSelectSingle_74["PgSelectSingle[_74∈1]<br />ᐸmessagesᐳ"]:::plan
    First_73["First[_73∈1]"]:::plan
    PgSelect_72[["PgSelect[_72∈1]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression_33["PgClassExpression[_33∈1]<br />ᐸ__forums__.”id”ᐳ"]:::plan
    PgClassExpression_39["PgClassExpression[_39∈1]<br />ᐸ__forums__...chived_at”ᐳ"]:::plan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br />ᐸforumsᐳ"]:::plan
    __Item_21>"__Item[_21∈1]<br />ᐸ_17ᐳ"]:::itemplan
    PgSelect_17[["PgSelect[_17∈0]<br />ᐸforumsᐳ"]]:::plan
    Object_64["Object[_64∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_62["Access[_62∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_63["Access[_63∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan
    Constant_76["Constant[_76∈0]"]:::plan
    PgPageInfo_69["PgPageInfo[_69∈0]"]:::plan
    Constant_70["Constant[_70∈0]"]:::plan
    Constant_71["Constant[_71∈0]"]:::plan

    %% plan dependencies
    PgSelectSingle_22 --> PgClassExpression_23
    PgSelectSingle_42 --> PgClassExpression_43
    PgSelectSingle_50 --> PgClassExpression_51
    PgSelectSingle_50 --> PgClassExpression_52
    First_49 --> PgSelectSingle_50
    PgSelect_45 --> First_49
    Object_64 & PgClassExpression_44 --> PgSelect_45
    PgSelectSingle_42 --> PgClassExpression_44
    __Item_41 --> PgSelectSingle_42
    PgSelect_40 ==> __Item_41
    Object_64 & PgClassExpression_33 & PgClassExpression_39 --> PgSelect_40
    List_58 --> PgCursor_56
    PgClassExpression_57 --> List_58
    PgSelectSingle_55 --> PgClassExpression_57
    PgSelectSingle_55 --> PgClassExpression_59
    PgSelectSingle_66 --> PgClassExpression_67
    PgSelectSingle_66 --> PgClassExpression_68
    First_65 --> PgSelectSingle_66
    PgSelect_61 --> First_65
    Object_64 & PgClassExpression_60 --> PgSelect_61
    PgSelectSingle_55 --> PgClassExpression_60
    __Item_54 --> PgSelectSingle_55
    PgSelect_53 ==> __Item_54
    Object_64 & PgClassExpression_33 & PgClassExpression_39 --> PgSelect_53
    PgSelectSingle_74 --> PgClassExpression_75
    First_73 --> PgSelectSingle_74
    PgSelect_72 --> First_73
    Object_64 & PgClassExpression_33 & PgClassExpression_39 --> PgSelect_72
    PgSelectSingle_22 --> PgClassExpression_33
    PgSelectSingle_22 --> PgClassExpression_39
    __Item_21 --> PgSelectSingle_22
    PgSelect_17 ==> __Item_21
    Object_64 --> PgSelect_17
    Access_62 & Access_63 --> Object_64
    __Value_3 --> Access_62
    __Value_3 --> Access_63

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_17["ᐳforums"]
    PgSelect_17 -.-> P_17
    P_22["ᐳforums[]"]
    PgSelectSingle_22 -.-> P_22
    P_23["ᐳf…]ᐳname"]
    PgClassExpression_23 -.-> P_23
    P_40["ᐳf…]ᐳm…nᐳnodes"]
    PgSelect_40 -.-> P_40
    P_42["ᐳf…]ᐳm…nᐳnodes[]"]
    PgSelectSingle_42 -.-> P_42
    P_43["ᐳf…]ᐳm…nᐳn…]ᐳbody"]
    PgClassExpression_43 -.-> P_43
    P_50["ᐳf…]ᐳm…nᐳn…]ᐳauthor"]
    PgSelectSingle_50 -.-> P_50
    P_51["ᐳf…]ᐳm…nᐳn…]ᐳa…rᐳusername"]
    PgClassExpression_51 -.-> P_51
    P_52["ᐳf…]ᐳm…nᐳn…]ᐳa…rᐳgravatarUrl"]
    PgClassExpression_52 -.-> P_52
    P_53["ᐳf…]ᐳm…nᐳedges"]
    PgSelect_53 -.-> P_53
    P_55["ᐳf…]ᐳm…nᐳedges[]<br />ᐳf…]ᐳm…nᐳe…]ᐳnode"]
    PgSelectSingle_55 -.-> P_55
    P_56["ᐳf…]ᐳm…nᐳe…]ᐳcursor"]
    PgCursor_56 -.-> P_56
    P_59["ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳbody"]
    PgClassExpression_59 -.-> P_59
    P_66["ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳauthor"]
    PgSelectSingle_66 -.-> P_66
    P_67["ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳa…rᐳusername"]
    PgClassExpression_67 -.-> P_67
    P_68["ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳa…rᐳgravatarUrl"]
    PgClassExpression_68 -.-> P_68
    P_69["ᐳf…]ᐳm…nᐳpageInfo"]
    PgPageInfo_69 -.-> P_69
    P_70["ᐳf…]ᐳm…nᐳp…oᐳhasNextPage"]
    Constant_70 -.-> P_70
    P_71["ᐳf…]ᐳm…nᐳp…oᐳhasPreviousPage"]
    Constant_71 -.-> P_71
    P_75["ᐳf…]ᐳm…nᐳtotalCount"]
    PgClassExpression_75 -.-> P_75
    P_76["ᐳf…]ᐳmessagesConnection"]
    Constant_76 -.-> P_76

    subgraph "Buckets for queries/conditions/archived-forum-inherited-messages.stream-2"
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,PgSelect_17,Access_62,Access_63,Object_64,PgPageInfo_69,Constant_70,Constant_71,Constant_76 bucket0
    Bucket1("Bucket 1 (item_21)<br />Deps: _17, _64<br />~ᐳQuery.forums[]"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_21,PgSelectSingle_22,PgClassExpression_23,PgClassExpression_33,PgClassExpression_39,PgSelect_72,First_73,PgSelectSingle_74,PgClassExpression_75 bucket1
    Bucket2("Bucket 2 (group1[stream])<br />Deps: _64, _33, _39<br />~ᐳQuery.forums[]ᐳForum.messagesConnection"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,PgSelect_40 bucket2
    Bucket3("Bucket 3 (item_41)<br />Deps: _40, _64<br />~ᐳQuery.forums[]ᐳForum.messagesConnectionᐳMessagesConnection.nodes[]"):::bucket
    classDef bucket3 stroke:#ffa500
    class Bucket3,__Item_41,PgSelectSingle_42,PgClassExpression_43,PgClassExpression_44,PgSelect_45,First_49,PgSelectSingle_50,PgClassExpression_51,PgClassExpression_52 bucket3
    Bucket4("Bucket 4 (group2[stream])<br />Deps: _64, _33, _39<br />~ᐳQuery.forums[]ᐳForum.messagesConnection"):::bucket
    classDef bucket4 stroke:#0000ff
    class Bucket4,PgSelect_53 bucket4
    Bucket5("Bucket 5 (item_54)<br />Deps: _53, _64<br />~ᐳQuery.forums[]ᐳForum.messagesConnectionᐳMessagesConnection.edges[]"):::bucket
    classDef bucket5 stroke:#7fff00
    class Bucket5,__Item_54,PgSelectSingle_55,PgCursor_56,PgClassExpression_57,List_58,PgClassExpression_59,PgClassExpression_60,PgSelect_61,First_65,PgSelectSingle_66,PgClassExpression_67,PgClassExpression_68 bucket5
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2 & Bucket4
    Bucket2 --> Bucket3
    Bucket4 --> Bucket5
    end
```
