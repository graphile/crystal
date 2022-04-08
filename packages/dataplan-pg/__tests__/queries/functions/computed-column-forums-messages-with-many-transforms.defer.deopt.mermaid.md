```mermaid
graph TD
    classDef path fill:#eee,stroke:#000,color:#000
    classDef plan fill:#fff,stroke-width:3px,color:#000
    classDef itemplan fill:#fff,stroke-width:6px,color:#000
    classDef sideeffectplan fill:#f00,stroke-width:6px,color:#000
    classDef bucket fill:#f6f6f6,color:#000,stroke-width:6px,text-align:left


    %% define plans
    __Value0["__Value[0∈0]"]:::plan
    __Value3["__Value[3∈0]<br />ᐸcontextᐳ"]:::plan
    Access18["Access[18∈0]<br />ᐸ3.pgSettingsᐳ"]:::plan
    Access19["Access[19∈0]<br />ᐸ3.withPgClientᐳ"]:::plan
    Object20["Object[20∈0]<br />ᐸ{pgSettings,withPgClient}ᐳ"]:::plan
    PgSelect17[["PgSelect[17∈0]<br />ᐸforumsᐳ"]]:::plan
    __Item21>"__Item[21∈1]<br />ᐸ17ᐳ"]:::itemplan
    PgSelectSingle22["PgSelectSingle[22∈1]<br />ᐸforumsᐳ"]:::plan
    PgClassExpression23["PgClassExpression[23∈1]<br />ᐸ__forums__.”name”ᐳ"]:::plan
    PgSelect24[["PgSelect[24∈2@1]<br />ᐸmessagesᐳ"]]:::plan
    PgClassExpression35["PgClassExpression[35∈2@1]<br />ᐸ__forums__.”id”ᐳ"]:::plan
    __ListTransform28["__ListTransform[28∈2@1]<br />ᐸfilter:24ᐳ"]:::plan
    __ListTransform29["__ListTransform[29∈2@1]<br />ᐸgroupBy:28ᐳ"]:::plan
    Lambda30["Lambda[30∈2@1]"]:::plan
    __ListTransform31["__ListTransform[31∈2@1]<br />ᐸeach:30ᐳ"]:::plan
    __Item32>"__Item[32∈3@1]<br />ᐸ24ᐳ"]:::itemplan
    PgSelectSingle33["PgSelectSingle[33∈3@1]<br />ᐸmessagesᐳ"]:::plan
    PgClassExpression34["PgClassExpression[34∈3@1]<br />ᐸ__messages__.”forum_id”ᐳ"]:::plan
    List36["List[36∈3@1]<br />ᐸ34,35ᐳ"]:::plan
    Lambda37["Lambda[37∈3@1]"]:::plan
    __Item38>"__Item[38∈4@1]<br />ᐸ28ᐳ"]:::itemplan
    PgSelectSingle39["PgSelectSingle[39∈4@1]<br />ᐸmessagesᐳ"]:::plan
    PgClassExpression40["PgClassExpression[40∈4@1]<br />ᐸ__messages__.”featured”ᐳ"]:::plan
    __Item41>"__Item[41∈5@1]<br />ᐸ30ᐳ"]:::itemplan
    __Item42>"__Item[42∈6@1]<br />ᐸ31ᐳ"]:::itemplan
    __ListTransform43["__ListTransform[43∈6@1]<br />ᐸeach:42ᐳ"]:::plan
    __Item44>"__Item[44∈7@1]<br />ᐸ42ᐳ"]:::itemplan
    __Item45>"__Item[45∈8@1]<br />ᐸ43ᐳ"]:::itemplan
    PgSelectSingle46["PgSelectSingle[46∈8@1]<br />ᐸmessagesᐳ"]:::plan
    PgClassExpression47["PgClassExpression[47∈8@1]<br />ᐸ__messages__.”body”ᐳ"]:::plan
    PgClassExpression48["PgClassExpression[48∈8@1]<br />ᐸ__messages__.”featured”ᐳ"]:::plan

    %% plan dependencies
    __Value3 --> Access18
    __Value3 --> Access19
    Access18 & Access19 --> Object20
    Object20 --> PgSelect17
    PgSelect17 ==> __Item21
    __Item21 --> PgSelectSingle22
    PgSelectSingle22 --> PgClassExpression23
    Object20 --> PgSelect24
    PgSelectSingle22 --> PgClassExpression35
    PgSelect24 & PgClassExpression35 --> __ListTransform28
    Lambda37 -.-> __ListTransform28
    __ListTransform28 --> __ListTransform29
    PgClassExpression40 -.-> __ListTransform29
    __ListTransform29 --> Lambda30
    Lambda30 --> __ListTransform31
    __Item41 -.-> __ListTransform31
    PgSelect24 -.-> __Item32
    PgClassExpression35 --> __Item32
    __Item32 --> PgSelectSingle33
    PgSelectSingle33 --> PgClassExpression34
    PgClassExpression34 & PgClassExpression35 --> List36
    List36 --> Lambda37
    __ListTransform28 -.-> __Item38
    __Item38 --> PgSelectSingle39
    PgSelectSingle39 --> PgClassExpression40
    Lambda30 -.-> __Item41
    __ListTransform31 ==> __Item42
    __Item42 --> __ListTransform43
    __Item44 -.-> __ListTransform43
    __Item42 -.-> __Item44
    __ListTransform43 ==> __Item45
    __Item45 --> PgSelectSingle46
    PgSelectSingle46 --> PgClassExpression47
    PgSelectSingle46 --> PgClassExpression48

    %% plan-to-path relationships
    P0["~"]
    __Value0 -.-> P0
    P17["ᐳforums"]
    PgSelect17 -.-> P17
    P22["ᐳforums[]"]
    PgSelectSingle22 -.-> P22
    P23["ᐳf…]ᐳname"]
    PgClassExpression23 -.-> P23
    P31["ᐳf…]ᐳmessagesWithManyTransforms"]
    __ListTransform31 -.-> P31
    P37["ᐳf…]ᐳmessagesWithManyTransforms@28[]"]
    Lambda37 -.-> P37
    P40["ᐳf…]ᐳmessagesWithManyTransforms@29[]"]
    PgClassExpression40 -.-> P40
    P41["ᐳf…]ᐳmessagesWithManyTransforms@31[]"]
    __Item41 -.-> P41
    P43["ᐳf…]ᐳmessagesWithManyTransforms[]"]
    __ListTransform43 -.-> P43
    P44["ᐳf…]ᐳmessagesWithManyTransforms[]@43[]"]
    __Item44 -.-> P44
    P46["ᐳf…]ᐳmessagesWithManyTransforms[][]"]
    PgSelectSingle46 -.-> P46
    P47["ᐳf…]ᐳm…]ᐳbody"]
    PgClassExpression47 -.-> P47
    P48["ᐳf…]ᐳm…]ᐳfeatured"]
    PgClassExpression48 -.-> P48

    subgraph "Buckets for queries/functions/computed-column-forums-messages-with-many-transforms.defer"
    Bucket0("Bucket 0 (root)<br />~"):::bucket
    classDef bucket0 stroke:#696969
    class Bucket0,__Value0,__Value3,PgSelect17,Access18,Access19,Object20 bucket0
    Bucket1("Bucket 1 (item21)<br />Deps: 17, 20<br />~ᐳQuery.forums[]"):::bucket
    classDef bucket1 stroke:#00bfff
    class Bucket1,__Item21,PgSelectSingle22,PgClassExpression23 bucket1
    Bucket2("Bucket 2 (group1[defer])<br />Deps: 20, 22<br />~ᐳQuery.forums[]"):::bucket
    classDef bucket2 stroke:#7f007f
    class Bucket2,PgSelect24,__ListTransform28,__ListTransform29,Lambda30,__ListTransform31,PgClassExpression35 bucket2
    Bucket3("Bucket 3 (item32)<br />Deps: 24, 35"):::bucket
    classDef bucket3 stroke:#ffa500
    class Bucket3,__Item32,PgSelectSingle33,PgClassExpression34,List36,Lambda37 bucket3
    Bucket4("Bucket 4 (item38)<br />Deps: 28"):::bucket
    classDef bucket4 stroke:#0000ff
    class Bucket4,__Item38,PgSelectSingle39,PgClassExpression40 bucket4
    Bucket5("Bucket 5 (item41)<br />Deps: 30"):::bucket
    classDef bucket5 stroke:#7fff00
    class Bucket5,__Item41 bucket5
    Bucket6("Bucket 6 (item42)<br />Deps: 31<br />~ᐳQuery.forums[]ᐳForum.messagesWithManyTransforms[]"):::bucket
    classDef bucket6 stroke:#ff1493
    class Bucket6,__Item42,__ListTransform43 bucket6
    Bucket7("Bucket 7 (item44)<br />Deps: 42"):::bucket
    classDef bucket7 stroke:#808000
    class Bucket7,__Item44 bucket7
    Bucket8("Bucket 8 (item45)<br />Deps: 43<br />~ᐳQuery.forums[]ᐳForum.messagesWithManyTransforms[][]"):::bucket
    classDef bucket8 stroke:#dda0dd
    class Bucket8,__Item45,PgSelectSingle46,PgClassExpression47,PgClassExpression48 bucket8
    Bucket0 --> Bucket1
    Bucket1 --> Bucket2
    Bucket2 --> Bucket3 & Bucket4 & Bucket5 & Bucket6
    Bucket6 --> Bucket7 & Bucket8
    end
```
