```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value_0["__Value[_0∈0]"]:::plan
    PgClassExpression_37["PgClassExpression[_37∈5]<br />ᐸ__forums_m...t__.”body”ᐳ"]:::plan
    PgClassExpression_38["PgClassExpression[_38∈5]<br />ᐸ__forums_m...”featured”ᐳ"]:::plan
    PgSelectSingle_36["PgSelectSingle[_36∈5]<br />ᐸforums_messages_list_setᐳ"]:::plan
    __Item_35>"__Item[_35∈5]<br />ᐸ_33ᐳ"]:::itemplan
    __ListTransform_33["__ListTransform[_33∈3]<br />ᐸeach:_32ᐳ"]:::plan
    __Item_34>"__Item[_34∈4]<br />ᐸ_32ᐳ"]:::itemplan
    __Item_32>"__Item[_32∈3]<br />ᐸ_28ᐳ"]:::itemplan
    __ListTransform_28["__ListTransform[_28∈1]<br />ᐸpartitionByIndex1:_24ᐳ"]:::plan
    PgClassExpression_31["PgClassExpression[_31∈2]<br />ᐸ__forums_m..._set_idx__ᐳ"]:::plan
    PgSelectSingle_30["PgSelectSingle[_30∈2]<br />ᐸforums_messages_list_setᐳ"]:::plan
    __Item_29>"__Item[_29∈2]<br />ᐸ_24ᐳ"]:::itemplan
    PgSelect_24[["PgSelect[_24∈1]<br />ᐸforums_messages_list_setᐳ"]]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br />ᐸ__forums__ᐳ"]:::plan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br />ᐸforumsᐳ"]:::plan
    __Item_21>"__Item[_21∈1]<br />ᐸ_17ᐳ"]:::itemplan
    PgSelect_17[["PgSelect[_17∈0]<br />ᐸforumsᐳ"]]:::plan
    Object_27["Object[_27∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    Access_25["Access[_25∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_26["Access[_26∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    __Value_3["__Value[_3∈0]<br />ᐸcontextᐳ"]:::plan

    %% plan dependencies
    PgSelectSingle_36 --> PgClassExpression_37
    PgSelectSingle_36 --> PgClassExpression_38
    __Item_35 --> PgSelectSingle_36
    __ListTransform_33 ==> __Item_35
    __Item_32 --> __ListTransform_33
    __Item_34 -.-> __ListTransform_33
    __Item_32 -.-> __Item_34
    __ListTransform_28 ==> __Item_32
    PgSelect_24 --> __ListTransform_28
    PgClassExpression_31 -.-> __ListTransform_28
    PgSelectSingle_30 --> PgClassExpression_31
    __Item_29 --> PgSelectSingle_30
    PgSelect_24 -.-> __Item_29
    Object_27 & PgClassExpression_23 --> PgSelect_24
    PgSelectSingle_22 --> PgClassExpression_23
    __Item_21 --> PgSelectSingle_22
    PgSelect_17 ==> __Item_21
    Object_27 --> PgSelect_17
    Access_25 & Access_26 --> Object_27
    __Value_3 --> Access_25
    __Value_3 --> Access_26

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_17["ᐳforums"]
    PgSelect_17 -.-> P_17
    P_22["ᐳforums[]"]
    PgSelectSingle_22 -.-> P_22
    P_28["ᐳf…]ᐳmessagesListSet"]
    __ListTransform_28 -.-> P_28
    P_31["ᐳf…]ᐳmessagesListSet@_28[]"]
    PgClassExpression_31 -.-> P_31
    P_33["ᐳf…]ᐳmessagesListSet[]"]
    __ListTransform_33 -.-> P_33
    P_34["ᐳf…]ᐳmessagesListSet[]@_33[]"]
    __Item_34 -.-> P_34
    P_36["ᐳf…]ᐳmessagesListSet[][]"]
    PgSelectSingle_36 -.-> P_36
    P_37["ᐳf…]ᐳm…]ᐳbody"]
    PgClassExpression_37 -.-> P_37
    P_38["ᐳf…]ᐳm…]ᐳfeatured"]
    PgClassExpression_38 -.-> P_38

    subgraph "Buckets for queries/functions/computed-column-forums-messages-list-set"
    Bucket0("Bucket 0 (root)<br />~<br />⠀ROOT ᐸ-O- _0<br />⠀⠀forums ᐸ-A- _17"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value_0,__Value_3,PgSelect_17,Access_25,Access_26,Object_27 bucket0
    Bucket1("Bucket 1 (item_21)<br />Deps: _17, _27<br />~ᐳQuery.forums[]<br />⠀ROOT ᐸ-O- _22<br />⠀⠀messagesListSet ᐸ-A- _28"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item_21,PgSelectSingle_22,PgClassExpression_23,PgSelect_24,__ListTransform_28 bucket1
    Bucket2("Bucket 2 (item_29)<br />Deps: _24"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,__Item_29,PgSelectSingle_30,PgClassExpression_31 bucket2
    Bucket3("Bucket 3 (item_32)<br />Deps: _28<br />~ᐳQuery.forums[]ᐳForum.messagesListSet[]<br />⠀ROOT ᐸ-A- _33"):::bucket
    classDef bucket3 stroke:#ffa500
    class Bucket3,__Item_32,__ListTransform_33 bucket3
    Bucket4("Bucket 4 (item_34)<br />Deps: _32"):::bucket
    classDef bucket4 stroke:#0000ff
    class Bucket4,__Item_34 bucket4
    Bucket5("Bucket 5 (item_35)<br />Deps: _33<br />~ᐳQuery.forums[]ᐳForum.messagesListSet[][]<br />⠀ROOT ᐸ-O- _36<br />⠀⠀body ᐸ-L- _37<br />⠀⠀featured ᐸ-L- _38"):::bucket
    classDef bucket5 stroke:#7fff00
    class Bucket5,__Item_35,PgSelectSingle_36,PgClassExpression_37,PgClassExpression_38 bucket5
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2 & Bucket3
    Bucket3 --> Bucket4 & Bucket5
    end
```
