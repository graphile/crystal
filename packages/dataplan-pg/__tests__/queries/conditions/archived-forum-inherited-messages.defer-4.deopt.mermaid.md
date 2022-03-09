```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value0["__Value[0∈0]"]:::plan
    PgClassExpression23["PgClassExpression[23∈1]<br />ᐸ__forums__.”name”ᐳ"]:::plan
    PgClassExpression43["PgClassExpression[43∈2]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression51["PgClassExpression[51∈2]<br />ᐸ__users__.”username”ᐳ"]:::plan
    PgClassExpression52["PgClassExpression[52∈2]<br />ᐸ__users__....vatar_url”ᐳ"]:::plan
    PgSelectSingle50["PgSelectSingle[50∈2]<br />ᐸusersᐳ"]:::plan
    First49["First[49∈2]"]:::plan
    PgSelect45[["PgSelect[45∈2]<br />ᐸusersᐳ"]]:::plan
    PgClassExpression44["PgClassExpression[44∈2]<br />ᐸ__messages...author_id”ᐳ"]:::plan
    PgCursor55["PgCursor[55∈2]"]:::plan
    List57["List[57∈2]<br />ᐸ56ᐳ"]:::plan
    PgClassExpression56["PgClassExpression[56∈2]<br />ᐸ__messages__.”id”ᐳ"]:::plan
    PgSelectSingle42["PgSelectSingle[42∈2]<br />ᐸmessagesᐳ"]:::plan
    __Item41>"__Item[41∈2]<br />ᐸ34ᐳ"]:::itemplan
    PgCursor74["PgCursor[74∈1]"]:::plan
    List76["List[76∈1]<br />ᐸ75ᐳ"]:::plan
    PgClassExpression75["PgClassExpression[75∈1]<br />ᐸ__messages__.”id”ᐳ"]:::plan
    PgSelectSingle73["PgSelectSingle[73∈1]<br />ᐸmessagesᐳ"]:::plan
    First72["First[72∈1]"]:::plan
    PgCursor80["PgCursor[80∈1]"]:::plan
    List82["List[82∈1]<br />ᐸ81ᐳ"]:::plan
    PgClassExpression81["PgClassExpression[81∈1]<br />ᐸ__messages__.”id”ᐳ"]:::plan
    PgSelectSingle79["PgSelectSingle[79∈1]<br />ᐸmessagesᐳ"]:::plan
    Last78["Last[78∈1]"]:::plan
    PgSelect34[["PgSelect[34∈1]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression86["PgClassExpression[86∈1]<br />ᐸcount(*)ᐳ"]:::plan
    PgSelectSingle85["PgSelectSingle[85∈1]<br />ᐸmessagesᐳ"]:::plan
    First84["First[84∈1]"]:::plan
    PgSelect83[["PgSelect[83∈1]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression33["PgClassExpression[33∈1]<br />ᐸ__forums__.”id”ᐳ"]:::plan
    PgClassExpression39["PgClassExpression[39∈1]<br />ᐸ__forums__...chived_at”ᐳ"]:::plan
    PgSelectSingle22["PgSelectSingle[22∈1]<br />ᐸforumsᐳ"]:::plan
    __Item21>"__Item[21∈1]<br />ᐸ17ᐳ"]:::itemplan
    PgSelect17[["PgSelect[17∈0]<br />ᐸforumsᐳ"]]:::plan
    Object63["Object[63∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access61["Access[61∈0]<br />ᐸ3.pgSettingsᐳ"]:::plan
    Access62["Access[62∈0]<br />ᐸ3.withPgClientᐳ"]:::plan
    __Value3["__Value[3∈0]<br />ᐸcontextᐳ"]:::plan
    Constant87["Constant[87∈0]"]:::plan
    PgPageInfo68["PgPageInfo[68∈0]"]:::plan
    Constant69["Constant[69∈0]"]:::plan
    Constant70["Constant[70∈0]"]:::plan

    %% plan dependencies
    PgSelectSingle22 --> PgClassExpression23
    PgSelectSingle42 --> PgClassExpression43
    PgSelectSingle50 --> PgClassExpression51
    PgSelectSingle50 --> PgClassExpression52
    First49 --> PgSelectSingle50
    PgSelect45 --> First49
    Object63 & PgClassExpression44 --> PgSelect45
    PgSelectSingle42 --> PgClassExpression44
    List57 --> PgCursor55
    PgClassExpression56 --> List57
    PgSelectSingle42 --> PgClassExpression56
    __Item41 --> PgSelectSingle42
    PgSelect34 ==> __Item41
    List76 --> PgCursor74
    PgClassExpression75 --> List76
    PgSelectSingle73 --> PgClassExpression75
    First72 --> PgSelectSingle73
    PgSelect34 --> First72
    List82 --> PgCursor80
    PgClassExpression81 --> List82
    PgSelectSingle79 --> PgClassExpression81
    Last78 --> PgSelectSingle79
    PgSelect34 --> Last78
    Object63 & PgClassExpression33 & PgClassExpression39 --> PgSelect34
    PgSelectSingle85 --> PgClassExpression86
    First84 --> PgSelectSingle85
    PgSelect83 --> First84
    Object63 & PgClassExpression33 & PgClassExpression39 --> PgSelect83
    PgSelectSingle22 --> PgClassExpression33
    PgSelectSingle22 --> PgClassExpression39
    __Item21 --> PgSelectSingle22
    PgSelect17 ==> __Item21
    Object63 --> PgSelect17
    Access61 & Access62 --> Object63
    __Value3 --> Access61
    __Value3 --> Access62

    %% plan-to-path relationships
    P0["~"]
    __Value0 -.-> P0
    P17["ᐳforums"]
    PgSelect17 -.-> P17
    P22["ᐳforums[]"]
    PgSelectSingle22 -.-> P22
    P23["ᐳf…]ᐳname"]
    PgClassExpression23 -.-> P23
    P34["ᐳf…]ᐳm…nᐳnodes<br />ᐳf…]ᐳm…nᐳedges"]
    PgSelect34 -.-> P34
    P42["ᐳf…]ᐳm…nᐳnodes[]<br />ᐳf…]ᐳm…nᐳedges[]<br />ᐳf…]ᐳm…nᐳe…]ᐳnode"]
    PgSelectSingle42 -.-> P42
    P43["ᐳf…]ᐳm…nᐳn…]ᐳbody<br />ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳbody"]
    PgClassExpression43 -.-> P43
    P50["ᐳf…]ᐳm…nᐳn…]ᐳauthor<br />ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳauthor"]
    PgSelectSingle50 -.-> P50
    P51["ᐳf…]ᐳm…nᐳn…]ᐳa…rᐳusername<br />ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳa…rᐳusername"]
    PgClassExpression51 -.-> P51
    P52["ᐳf…]ᐳm…nᐳn…]ᐳa…rᐳgravatarUrl<br />ᐳf…]ᐳm…nᐳe…]ᐳnodeᐳa…rᐳgravatarUrl"]
    PgClassExpression52 -.-> P52
    P55["ᐳf…]ᐳm…nᐳe…]ᐳcursor"]
    PgCursor55 -.-> P55
    P68["ᐳf…]ᐳm…nᐳpageInfo"]
    PgPageInfo68 -.-> P68
    P69["ᐳf…]ᐳm…nᐳp…oᐳhasNextPage"]
    Constant69 -.-> P69
    P70["ᐳf…]ᐳm…nᐳp…oᐳhasPreviousPage"]
    Constant70 -.-> P70
    P74["ᐳf…]ᐳm…nᐳp…oᐳstartCursor"]
    PgCursor74 -.-> P74
    P80["ᐳf…]ᐳm…nᐳp…oᐳendCursor"]
    PgCursor80 -.-> P80
    P86["ᐳf…]ᐳm…nᐳtotalCount"]
    PgClassExpression86 -.-> P86
    P87["ᐳf…]ᐳmessagesConnection"]
    Constant87 -.-> P87

    subgraph "Buckets for queries/conditions/archived-forum-inherited-messages.defer-4"
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value0,__Value3,PgSelect17,Access61,Access62,Object63,PgPageInfo68,Constant69,Constant70,Constant87 bucket0
    Bucket1("Bucket 1 (item21)<br />Deps: 17, 63<br />~ᐳQuery.forums[]"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item21,PgSelectSingle22,PgClassExpression23,PgClassExpression33,PgSelect34,PgClassExpression39,First72,PgSelectSingle73,PgCursor74,PgClassExpression75,List76,Last78,PgSelectSingle79,PgCursor80,PgClassExpression81,List82,PgSelect83,First84,PgSelectSingle85,PgClassExpression86 bucket1
    Bucket2("Bucket 2 (item41)<br />Deps: 34, 63<br />~ᐳQuery.forums[]ᐳForum.messagesConnectionᐳMessagesConnection.nodes[]<br />~ᐳQuery.forums[]ᐳForum.messagesConnectionᐳMessagesConnection.edges[]"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item41,PgSelectSingle42,PgClassExpression43,PgClassExpression44,PgSelect45,First49,PgSelectSingle50,PgClassExpression51,PgClassExpression52,PgCursor55,PgClassExpression56,List57 bucket2
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2
    end
```
