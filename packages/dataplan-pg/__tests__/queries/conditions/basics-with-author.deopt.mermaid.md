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
    PgClassExpression_40["PgClassExpression[_40∈2]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression_48["PgClassExpression[_48∈2]<br />ᐸ__users__.”username”ᐳ"]:::plan
    PgClassExpression_49["PgClassExpression[_49∈2]<br />ᐸ__users__....vatar_url”ᐳ"]:::plan
    PgSelectSingle_47["PgSelectSingle[_47∈2]<br />ᐸusersᐳ"]:::plan
    First_46["First[_46∈2]"]:::plan
    PgSelect_42[["PgSelect[_42∈2]<br />ᐸusersᐳ"]]:::plan
    PgClassExpression_41["PgClassExpression[_41∈2]<br />ᐸ__messages...author_id”ᐳ"]:::plan
    PgSelectSingle_39["PgSelectSingle[_39∈2]<br />ᐸmessagesᐳ"]:::plan
    __Item_38>"__Item[_38∈2]<br />ᐸ_33ᐳ"]:::itemplan
    PgSelect_33[["PgSelect[_33∈1]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression_32["PgClassExpression[_32∈1]<br />ᐸ__forums__.”id”ᐳ"]:::plan
    PgClassExpression_37["PgClassExpression[_37∈1]<br />ᐸ__forums__...chived_at”ᐳ"]:::plan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br />ᐸforumsᐳ"]:::plan
    __Item_21>"__Item[_21∈1]<br />ᐸ_17ᐳ"]:::itemplan
    PgSelect_17[["PgSelect[_17∈0]<br />ᐸforumsᐳ"]]:::plan
    Object_45["Object[_45∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_43["Access[_43∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_44["Access[_44∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan

    %% plan dependencies
    PgSelectSingle_22 --> PgClassExpression_23
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_47 --> PgClassExpression_48
    PgSelectSingle_47 --> PgClassExpression_49
    First_46 --> PgSelectSingle_47
    PgSelect_42 --> First_46
    Object_45 & PgClassExpression_41 --> PgSelect_42
    PgSelectSingle_39 --> PgClassExpression_41
    __Item_38 --> PgSelectSingle_39
    PgSelect_33 ==> __Item_38
    Object_45 & PgClassExpression_32 & PgClassExpression_37 --> PgSelect_33
    PgSelectSingle_22 --> PgClassExpression_32
    PgSelectSingle_22 --> PgClassExpression_37
    __Item_21 --> PgSelectSingle_22
    PgSelect_17 ==> __Item_21
    Object_45 --> PgSelect_17
    Access_43 & Access_44 --> Object_45
    __Value_3 --> Access_43
    __Value_3 --> Access_44

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_17["ᐳforums"]
    PgSelect_17 -.-> P_17
    P_22["ᐳforums[]"]
    PgSelectSingle_22 -.-> P_22
    P_23["ᐳf…]ᐳname"]
    PgClassExpression_23 -.-> P_23
    P_33["ᐳf…]ᐳmessagesList"]
    PgSelect_33 -.-> P_33
    P_39["ᐳf…]ᐳmessagesList[]"]
    PgSelectSingle_39 -.-> P_39
    P_40["ᐳf…]ᐳm…]ᐳbody"]
    PgClassExpression_40 -.-> P_40
    P_47["ᐳf…]ᐳm…]ᐳauthor"]
    PgSelectSingle_47 -.-> P_47
    P_48["ᐳf…]ᐳm…]ᐳa…rᐳusername"]
    PgClassExpression_48 -.-> P_48
    P_49["ᐳf…]ᐳm…]ᐳa…rᐳgravatarUrl"]
    PgClassExpression_49 -.-> P_49

    subgraph "Buckets for queries/conditions/basics-with-author"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀forums ᐸ-A- _17"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,PgSelect_17,Access_43,Access_44,Object_45 bucket0
    Bucket1("Bucket 1 (item_21)<br />Deps: _17, _45<br />~ᐳQuery.forums[]<br />⠀ROOT ᐸ-O- _22<br />⠀⠀name ᐸ-L- _23<br />⠀⠀messagesList ᐸ-A- _33"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_21,PgSelectSingle_22,PgClassExpression_23,PgClassExpression_32,PgSelect_33,PgClassExpression_37 bucket1
    Bucket2("Bucket 2 (item_38)<br />Deps: _33, _45<br />~ᐳQuery.forums[]ᐳForum.messagesList[]<br />⠀ROOT ᐸ-O- _39<br />⠀⠀body ᐸ-L- _40<br />⠀⠀author ᐸ-O- _47<br />⠀⠀⠀author.username ᐸ-L- _48<br />⠀⠀⠀author.gravatarUrl ᐸ-L- _49"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item_38,PgSelectSingle_39,PgClassExpression_40,PgClassExpression_41,PgSelect_42,First_46,PgSelectSingle_47,PgClassExpression_48,PgClassExpression_49 bucket2
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2
    end
```
