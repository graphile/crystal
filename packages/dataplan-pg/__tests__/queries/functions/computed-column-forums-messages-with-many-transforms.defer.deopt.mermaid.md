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
    PgSelect_17[["PgSelect[_17∈0]<br />ᐸforumsᐳ"]]:::plan
    Access_18["Access[_18∈0]<br />ᐸ_3.pgSettingsᐳ"]:::plan
    Access_19["Access[_19∈0]<br />ᐸ_3.withPgClientᐳ"]:::plan
    Object_20["Object[_20∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    __Item_21>"__Item[_21∈1]<br />ᐸ_17ᐳ"]:::itemplan
    PgSelectSingle_22["PgSelectSingle[_22∈1]<br />ᐸforumsᐳ"]:::plan
    PgClassExpression_23["PgClassExpression[_23∈1]<br />ᐸ__forums__.”name”ᐳ"]:::plan
    PgSelect_24[["PgSelect[_24∈2@1]<br />ᐸmessagesᐳ"]]:::plan
    __ListTransform_28["__ListTransform[_28∈2@1]<br />ᐸfilter:_24ᐳ"]:::plan
    __ListTransform_29["__ListTransform[_29∈2@1]<br />ᐸgroupBy:_28ᐳ"]:::plan
    Lambda_30["Lambda[_30∈2@1]"]:::plan
    __ListTransform_31["__ListTransform[_31∈2@1]<br />ᐸeach:_30ᐳ"]:::plan
    __Item_32>"__Item[_32∈3@1]<br />ᐸ_24ᐳ"]:::itemplan
    PgSelectSingle_33["PgSelectSingle[_33∈3@1]<br />ᐸmessagesᐳ"]:::plan
    PgClassExpression_34["PgClassExpression[_34∈3@1]<br />ᐸ__messages__.”forum_id”ᐳ"]:::plan
    PgClassExpression_35["PgClassExpression[_35∈2@1]<br />ᐸ__forums__.”id”ᐳ"]:::plan
    List_36["List[_36∈3@1]<br />ᐸ_34,_35ᐳ"]:::plan
    Lambda_37["Lambda[_37∈3@1]"]:::plan
    __Item_38>"__Item[_38∈4@1]<br />ᐸ_28ᐳ"]:::itemplan
    PgSelectSingle_39["PgSelectSingle[_39∈4@1]<br />ᐸmessagesᐳ"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈4@1]<br />ᐸ__messages__.”featured”ᐳ"]:::plan
    __Item_41>"__Item[_41∈5@1]<br />ᐸ_30ᐳ"]:::itemplan
    __Item_42>"__Item[_42∈6@1]<br />ᐸ_31ᐳ"]:::itemplan
    __ListTransform_43["__ListTransform[_43∈6@1]<br />ᐸeach:_42ᐳ"]:::plan
    __Item_44>"__Item[_44∈7@1]<br />ᐸ_42ᐳ"]:::itemplan
    __Item_45>"__Item[_45∈8@1]<br />ᐸ_43ᐳ"]:::itemplan
    PgSelectSingle_46["PgSelectSingle[_46∈8@1]<br />ᐸmessagesᐳ"]:::plan
    PgClassExpression_47["PgClassExpression[_47∈8@1]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression_48["PgClassExpression[_48∈8@1]<br />ᐸ__messages__.”featured”ᐳ"]:::plan

    %% plan dependencies
    Object_20 --> PgSelect_17
    __Value_3 --> Access_18
    __Value_3 --> Access_19
    Access_18 & Access_19 --> Object_20
    PgSelect_17 ==> __Item_21
    __Item_21 --> PgSelectSingle_22
    PgSelectSingle_22 --> PgClassExpression_23
    Object_20 --> PgSelect_24
    PgSelect_24 & PgClassExpression_35 --> __ListTransform_28
    Lambda_37 -.-> __ListTransform_28
    __ListTransform_28 --> __ListTransform_29
    PgClassExpression_40 -.-> __ListTransform_29
    __ListTransform_29 --> Lambda_30
    Lambda_30 --> __ListTransform_31
    __Item_41 -.-> __ListTransform_31
    PgSelect_24 -.-> __Item_32
    PgClassExpression_35 --> __Item_32
    __Item_32 --> PgSelectSingle_33
    PgSelectSingle_33 --> PgClassExpression_34
    PgSelectSingle_22 --> PgClassExpression_35
    PgClassExpression_34 & PgClassExpression_35 --> List_36
    List_36 --> Lambda_37
    __ListTransform_28 -.-> __Item_38
    __Item_38 --> PgSelectSingle_39
    PgSelectSingle_39 --> PgClassExpression_40
    Lambda_30 -.-> __Item_41
    __ListTransform_31 ==> __Item_42
    __Item_42 --> __ListTransform_43
    __Item_44 -.-> __ListTransform_43
    __Item_42 -.-> __Item_44
    __ListTransform_43 ==> __Item_45
    __Item_45 --> PgSelectSingle_46
    PgSelectSingle_46 --> PgClassExpression_47
    PgSelectSingle_46 --> PgClassExpression_48

    %% plan-to-path relationships
    P_0["~"]
    __Value_0 -.-> P_0
    P_17["ᐳforums"]
    PgSelect_17 -.-> P_17
    P_22["ᐳforums[]"]
    PgSelectSingle_22 -.-> P_22
    P_23["ᐳf…]ᐳname"]
    PgClassExpression_23 -.-> P_23
    P_31["ᐳf…]ᐳmessagesWithManyTransforms"]
    __ListTransform_31 -.-> P_31
    P_37["ᐳf…]ᐳmessagesWithManyTransforms@_28[]"]
    Lambda_37 -.-> P_37
    P_40["ᐳf…]ᐳmessagesWithManyTransforms@_29[]"]
    PgClassExpression_40 -.-> P_40
    P_41["ᐳf…]ᐳmessagesWithManyTransforms@_31[]"]
    __Item_41 -.-> P_41
    P_43["ᐳf…]ᐳmessagesWithManyTransforms[]"]
    __ListTransform_43 -.-> P_43
    P_44["ᐳf…]ᐳmessagesWithManyTransforms[]@_43[]"]
    __Item_44 -.-> P_44
    P_46["ᐳf…]ᐳmessagesWithManyTransforms[][]"]
    PgSelectSingle_46 -.-> P_46
    P_47["ᐳf…]ᐳm…]ᐳbody"]
    PgClassExpression_47 -.-> P_47
    P_48["ᐳf…]ᐳm…]ᐳfeatured"]
    PgClassExpression_48 -.-> P_48

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_0,__Value_3,PgSelect_17,Access_18,Access_19,Object_20 bucket0
    classDef bucket1 stroke:#00bfff
    class __Item_21,PgSelectSingle_22,PgClassExpression_23 bucket1
    classDef bucket2 stroke:#7f007f
    class PgSelect_24,__ListTransform_28,__ListTransform_29,Lambda_30,__ListTransform_31,PgClassExpression_35 bucket2
    classDef bucket3 stroke:#ffa500
    class __Item_32,PgSelectSingle_33,PgClassExpression_34,List_36,Lambda_37 bucket3
    classDef bucket4 stroke:#0000ff
    class __Item_38,PgSelectSingle_39,PgClassExpression_40 bucket4
    classDef bucket5 stroke:#7fff00
    class __Item_41 bucket5
    classDef bucket6 stroke:#ff1493
    class __Item_42,__ListTransform_43 bucket6
    classDef bucket7 stroke:#808000
    class __Item_44 bucket7
    classDef bucket8 stroke:#dda0dd
    class __Item_45,PgSelectSingle_46,PgClassExpression_47,PgClassExpression_48 bucket8

    subgraph "Buckets for queries/functions/computed-column-forums-messages-with-many-transforms.defer"
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    style Bucket0 stroke:#696969
    Bucket1("Bucket 1 (item_21)<br />Deps: _17, _20<br />~ᐳQuery.forums[]"):::bucket
    style Bucket1 stroke:#00bfff
    Bucket2("Bucket 2 (group1[defer])<br />Deps: _20, _22<br />~ᐳQuery.forums[]"):::bucket
    style Bucket2 stroke:#7f007f
    Bucket3("Bucket 3 (item_32)<br />Deps: _24, _35"):::bucket
    style Bucket3 stroke:#ffa500
    Bucket4("Bucket 4 (item_38)<br />Deps: _28"):::bucket
    style Bucket4 stroke:#0000ff
    Bucket5("Bucket 5 (item_41)<br />Deps: _30"):::bucket
    style Bucket5 stroke:#7fff00
    Bucket6("Bucket 6 (item_42)<br />Deps: _31<br />~ᐳQuery.forums[]ᐳForum.messagesWithManyTransforms[]"):::bucket
    style Bucket6 stroke:#ff1493
    Bucket7("Bucket 7 (item_44)<br />Deps: _42"):::bucket
    style Bucket7 stroke:#808000
    Bucket8("Bucket 8 (item_45)<br />Deps: _43<br />~ᐳQuery.forums[]ᐳForum.messagesWithManyTransforms[][]"):::bucket
    style Bucket8 stroke:#dda0dd
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2
    Bucket2 --> Bucket3 & Bucket4 & Bucket5 & Bucket6
    Bucket6 --> Bucket7 & Bucket8
    end
```
