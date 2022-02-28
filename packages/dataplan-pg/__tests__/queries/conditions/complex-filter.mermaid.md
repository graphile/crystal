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
    InputStaticLeaf_15["InputStaticLeaf[_15∈0]"]:::plan
    PgSelect_17[["PgSelect[_17∈0]<br />ᐸforumsᐳ"]]:::plan
    __Item_21>"__Item[_21∈1]<br />ᐸ_17ᐳ"]:::itemplan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br />ᐸforumsᐳ"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br />ᐸ__forums__.”name”ᐳ"]:::plan
    InputStaticLeaf_30["InputStaticLeaf[_30∈0]"]:::plan
    Access_34["Access[_34∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_35["Access[_35∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_36["Object[_36∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    __Item_38>"__Item[_38∈2]<br />ᐸ_42ᐳ"]:::itemplan
    PgSelectSingle_39["PgSelectSingle[_39∈2]<br />ᐸmessagesᐳ"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈2]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression_41["PgClassExpression[_41∈2]<br />ᐸ__messages__.”featured”ᐳ"]:::plan
    Access_42["Access[_42∈1]<br />ᐸ_21.1ᐳ"]:::plan

    %% plan dependencies
    Object_36 --> PgSelect_17
    InputStaticLeaf_15 --> PgSelect_17
    InputStaticLeaf_30 --> PgSelect_17
    PgSelect_17 ==> __Item_21
    __Item_21 --> PgSelectSingle_22
    PgSelectSingle_22 --> PgClassExpression_23
    __Value_3 --> Access_34
    __Value_3 --> Access_35
    Access_34 --> Object_36
    Access_35 --> Object_36
    Access_42 ==> __Item_38
    __Item_38 --> PgSelectSingle_39
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_39 --> PgClassExpression_41
    __Item_21 --> Access_42

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_17["ᐳforums"]
    PgSelect_17 -.-> P_17
    P_22["ᐳforums[]"]
    PgSelectSingle_22 -.-> P_22
    P_23["ᐳf…]ᐳname"]
    PgClassExpression_23 -.-> P_23
    P_39["ᐳf…]ᐳmessagesList[]"]
    PgSelectSingle_39 -.-> P_39
    P_40["ᐳf…]ᐳm…]ᐳbody"]
    PgClassExpression_40 -.-> P_40
    P_41["ᐳf…]ᐳm…]ᐳfeatured"]
    PgClassExpression_41 -.-> P_41
    P_42["ᐳf…]ᐳmessagesList"]
    Access_42 -.-> P_42

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,InputStaticLeaf_15,PgSelect_17,InputStaticLeaf_30,Access_34,Access_35,Object_36 bucket0
    classDef bucket1 stroke:#00bfff
    class __Item_21,PgSelectSingle_22,PgClassExpression_23,Access_42 bucket1
    classDef bucket2 stroke:#7f007f
    class __Item_38,PgSelectSingle_39,PgClassExpression_40,PgClassExpression_41 bucket2

    subgraph "Buckets for queries/conditions/complex-filter"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀forums ᐸ-A- _17"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_21)<br />Deps: _17<br />~ᐳQuery.forums[]<br />⠀ROOT ᐸ-O- _22<br />⠀⠀name ᐸ-L- _23<br />⠀⠀messagesList ᐸ-A- _42"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket0 --> Bucket1
    Bucket2("Bucket 2 (item_38)<br />Deps: _42<br />~ᐳQuery.forums[]ᐳForum.messagesList[]<br />⠀ROOT ᐸ-O- _39<br />⠀⠀body ᐸ-L- _40<br />⠀⠀featured ᐸ-L- _41"):::bucket
    style Bucket2 stroke:#7f007f
    Bucket1 --> Bucket2
    end
```
