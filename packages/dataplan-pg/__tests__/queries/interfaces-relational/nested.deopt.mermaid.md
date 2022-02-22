```mermaid
graph TD
    classDef path fill:#eee,stroke:#000
    classDef plan fill:#fff,stroke-width:3px
    classDef itemplan fill:#fff,stroke-width:6px
    classDef sideeffectplan fill:#f00,stroke-width:6px

    %% subgraph fields
    P1{{"~"}}:::path
    P2[/">people"\]:::path
    P3>">people[]"]:::path
    P2 -.- P3
    P4([">pe…e[]>username"]):::path
    %% P3 -.-> P4
    P5[/">pe…e[]>items"\]:::path
    P6>">pe…e[]>items[]"]:::path
    P5 -.- P6
    P7{{">pe…e[]>items[]>parent"}}:::path
    P8([">pe…e[]>items[]>parent>id"]):::path
    %% P7 -.-> P8
    P9([">pe…e[]>items[]>parent>type"]):::path
    %% P7 -.-> P9
    P10([">pe…e[]>items[]>parent>type2"]):::path
    %% P7 -.-> P10
    P11([">pe…e[]>items[]>parent>id"]):::path
    %% P7 -.-> P11
    P12([">pe…e[]>items[]>parent>type"]):::path
    %% P7 -.-> P12
    P13([">pe…e[]>items[]>parent>type2"]):::path
    %% P7 -.-> P13
    P14([">pe…e[]>items[]>parent>id"]):::path
    %% P7 -.-> P14
    P15([">pe…e[]>items[]>parent>type"]):::path
    %% P7 -.-> P15
    P16([">pe…e[]>items[]>parent>type2"]):::path
    %% P7 -.-> P16
    P17([">pe…e[]>items[]>parent>id"]):::path
    %% P7 -.-> P17
    P18([">pe…e[]>items[]>parent>type"]):::path
    %% P7 -.-> P18
    P19([">pe…e[]>items[]>parent>type2"]):::path
    %% P7 -.-> P19
    P20([">pe…e[]>items[]>parent>id"]):::path
    %% P7 -.-> P20
    P21([">pe…e[]>items[]>parent>type"]):::path
    %% P7 -.-> P21
    P22([">pe…e[]>items[]>parent>type2"]):::path
    %% P7 -.-> P22
    %% P6 -.-> P7
    P23([">pe…e[]>items[]>id"]):::path
    %% P6 -.-> P23
    P24([">pe…e[]>items[]>type"]):::path
    %% P6 -.-> P24
    P25([">pe…e[]>items[]>type2"]):::path
    %% P6 -.-> P25
    P26{{">pe…e[]>items[]>parent"}}:::path
    P27([">pe…e[]>items[]>parent>id"]):::path
    %% P26 -.-> P27
    P28([">pe…e[]>items[]>parent>type"]):::path
    %% P26 -.-> P28
    P29([">pe…e[]>items[]>parent>type2"]):::path
    %% P26 -.-> P29
    P30([">pe…e[]>items[]>parent>id"]):::path
    %% P26 -.-> P30
    P31([">pe…e[]>items[]>parent>type"]):::path
    %% P26 -.-> P31
    P32([">pe…e[]>items[]>parent>type2"]):::path
    %% P26 -.-> P32
    P33([">pe…e[]>items[]>parent>id"]):::path
    %% P26 -.-> P33
    P34([">pe…e[]>items[]>parent>type"]):::path
    %% P26 -.-> P34
    P35([">pe…e[]>items[]>parent>type2"]):::path
    %% P26 -.-> P35
    P36([">pe…e[]>items[]>parent>id"]):::path
    %% P26 -.-> P36
    P37([">pe…e[]>items[]>parent>type"]):::path
    %% P26 -.-> P37
    P38([">pe…e[]>items[]>parent>type2"]):::path
    %% P26 -.-> P38
    P39([">pe…e[]>items[]>parent>id"]):::path
    %% P26 -.-> P39
    P40([">pe…e[]>items[]>parent>type"]):::path
    %% P26 -.-> P40
    P41([">pe…e[]>items[]>parent>type2"]):::path
    %% P26 -.-> P41
    %% P6 -.-> P26
    P42([">pe…e[]>items[]>id"]):::path
    %% P6 -.-> P42
    P43([">pe…e[]>items[]>type"]):::path
    %% P6 -.-> P43
    P44([">pe…e[]>items[]>type2"]):::path
    %% P6 -.-> P44
    P45{{">pe…e[]>items[]>parent"}}:::path
    P46([">pe…e[]>items[]>parent>id"]):::path
    %% P45 -.-> P46
    P47([">pe…e[]>items[]>parent>type"]):::path
    %% P45 -.-> P47
    P48([">pe…e[]>items[]>parent>type2"]):::path
    %% P45 -.-> P48
    P49([">pe…e[]>items[]>parent>id"]):::path
    %% P45 -.-> P49
    P50([">pe…e[]>items[]>parent>type"]):::path
    %% P45 -.-> P50
    P51([">pe…e[]>items[]>parent>type2"]):::path
    %% P45 -.-> P51
    P52([">pe…e[]>items[]>parent>id"]):::path
    %% P45 -.-> P52
    P53([">pe…e[]>items[]>parent>type"]):::path
    %% P45 -.-> P53
    P54([">pe…e[]>items[]>parent>type2"]):::path
    %% P45 -.-> P54
    P55([">pe…e[]>items[]>parent>id"]):::path
    %% P45 -.-> P55
    P56([">pe…e[]>items[]>parent>type"]):::path
    %% P45 -.-> P56
    P57([">pe…e[]>items[]>parent>type2"]):::path
    %% P45 -.-> P57
    P58([">pe…e[]>items[]>parent>id"]):::path
    %% P45 -.-> P58
    P59([">pe…e[]>items[]>parent>type"]):::path
    %% P45 -.-> P59
    P60([">pe…e[]>items[]>parent>type2"]):::path
    %% P45 -.-> P60
    %% P6 -.-> P45
    P61([">pe…e[]>items[]>id"]):::path
    %% P6 -.-> P61
    P62([">pe…e[]>items[]>type"]):::path
    %% P6 -.-> P62
    P63([">pe…e[]>items[]>type2"]):::path
    %% P6 -.-> P63
    P64{{">pe…e[]>items[]>parent"}}:::path
    P65([">pe…e[]>items[]>parent>id"]):::path
    %% P64 -.-> P65
    P66([">pe…e[]>items[]>parent>type"]):::path
    %% P64 -.-> P66
    P67([">pe…e[]>items[]>parent>type2"]):::path
    %% P64 -.-> P67
    P68([">pe…e[]>items[]>parent>id"]):::path
    %% P64 -.-> P68
    P69([">pe…e[]>items[]>parent>type"]):::path
    %% P64 -.-> P69
    P70([">pe…e[]>items[]>parent>type2"]):::path
    %% P64 -.-> P70
    P71([">pe…e[]>items[]>parent>id"]):::path
    %% P64 -.-> P71
    P72([">pe…e[]>items[]>parent>type"]):::path
    %% P64 -.-> P72
    P73([">pe…e[]>items[]>parent>type2"]):::path
    %% P64 -.-> P73
    P74([">pe…e[]>items[]>parent>id"]):::path
    %% P64 -.-> P74
    P75([">pe…e[]>items[]>parent>type"]):::path
    %% P64 -.-> P75
    P76([">pe…e[]>items[]>parent>type2"]):::path
    %% P64 -.-> P76
    P77([">pe…e[]>items[]>parent>id"]):::path
    %% P64 -.-> P77
    P78([">pe…e[]>items[]>parent>type"]):::path
    %% P64 -.-> P78
    P79([">pe…e[]>items[]>parent>type2"]):::path
    %% P64 -.-> P79
    %% P6 -.-> P64
    P80([">pe…e[]>items[]>id"]):::path
    %% P6 -.-> P80
    P81([">pe…e[]>items[]>type"]):::path
    %% P6 -.-> P81
    P82([">pe…e[]>items[]>type2"]):::path
    %% P6 -.-> P82
    P83{{">pe…e[]>items[]>parent"}}:::path
    P84([">pe…e[]>items[]>parent>id"]):::path
    %% P83 -.-> P84
    P85([">pe…e[]>items[]>parent>type"]):::path
    %% P83 -.-> P85
    P86([">pe…e[]>items[]>parent>type2"]):::path
    %% P83 -.-> P86
    P87([">pe…e[]>items[]>parent>id"]):::path
    %% P83 -.-> P87
    P88([">pe…e[]>items[]>parent>type"]):::path
    %% P83 -.-> P88
    P89([">pe…e[]>items[]>parent>type2"]):::path
    %% P83 -.-> P89
    P90([">pe…e[]>items[]>parent>id"]):::path
    %% P83 -.-> P90
    P91([">pe…e[]>items[]>parent>type"]):::path
    %% P83 -.-> P91
    P92([">pe…e[]>items[]>parent>type2"]):::path
    %% P83 -.-> P92
    P93([">pe…e[]>items[]>parent>id"]):::path
    %% P83 -.-> P93
    P94([">pe…e[]>items[]>parent>type"]):::path
    %% P83 -.-> P94
    P95([">pe…e[]>items[]>parent>type2"]):::path
    %% P83 -.-> P95
    P96([">pe…e[]>items[]>parent>id"]):::path
    %% P83 -.-> P96
    P97([">pe…e[]>items[]>parent>type"]):::path
    %% P83 -.-> P97
    P98([">pe…e[]>items[]>parent>type2"]):::path
    %% P83 -.-> P98
    %% P6 -.-> P83
    P99([">pe…e[]>items[]>id"]):::path
    %% P6 -.-> P99
    P100([">pe…e[]>items[]>type"]):::path
    %% P6 -.-> P100
    P101([">pe…e[]>items[]>type2"]):::path
    %% P6 -.-> P101
    %% P3 -.-> P5
    %% P1 -.-> P2
    %% end

    %% define plans
    __Value_3["__Value[_3∈0]<br /><context>"]:::plan
    __Value_5["__Value[_5∈0]<br /><rootValue>"]:::plan
    PgSelect_7["PgSelect[_7∈0]<br /><people>"]:::plan
    __Item_11>"__Item[_11∈1]<br /><_7>"]:::itemplan
    PgSelectSingle_12["PgSelectSingle[_12∈1]<br /><people>"]:::plan
    PgClassExpression_13["PgClassExpression[_13∈1]<br /><__people__.#quot;username#quot;>"]:::plan
    PgClassExpression_14["PgClassExpression[_14∈1]<br /><__people__.#quot;person_id#quot;>"]:::plan
    PgSelect_15["PgSelect[_15∈1]<br /><relational_items>"]:::plan
    __ListTransform_19["__ListTransform[_19∈1]<br /><each:_15>"]:::plan
    __Item_20>"__Item[_20∈2]<br /><_15>"]:::itemplan
    PgSelectSingle_21["PgSelectSingle[_21∈2]<br /><relational_items>"]:::plan
    __Item_22>"__Item[_22∈3]<br /><_19>"]:::itemplan
    PgSelectSingle_23["PgSelectSingle[_23∈3]<br /><relational_items>"]:::plan
    PgClassExpression_24["PgClassExpression[_24∈3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_25["PgPolymorphic[_25∈3]"]:::plan
    PgClassExpression_33["PgClassExpression[_33∈3]<br /><__relation...parent_id#quot;>"]:::plan
    PgSelect_34["PgSelect[_34∈3]<br /><relational_items>"]:::plan
    First_38["First[_38∈3]"]:::plan
    PgSelectSingle_39["PgSelectSingle[_39∈3]<br /><relational_items>"]:::plan
    PgClassExpression_40["PgClassExpression[_40∈3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_41["PgPolymorphic[_41∈3]"]:::plan
    PgClassExpression_51["PgClassExpression[_51∈3]<br /><__relation...__.#quot;type2#quot;>"]:::plan
    PgClassExpression_94["PgClassExpression[_94∈3]<br /><__relation...__.#quot;type2#quot;>"]:::plan
    PgClassExpression_109["PgClassExpression[_109∈3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_110["PgPolymorphic[_110∈3]"]:::plan
    PgClassExpression_178["PgClassExpression[_178∈3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_179["PgPolymorphic[_179∈3]"]:::plan
    PgClassExpression_247["PgClassExpression[_247∈3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_248["PgPolymorphic[_248∈3]"]:::plan
    PgClassExpression_302["PgClassExpression[_302∈3]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    PgClassExpression_316["PgClassExpression[_316∈3]<br /><__relation...s__.#quot;type#quot;>"]:::plan
    PgPolymorphic_317["PgPolymorphic[_317∈3]"]:::plan
    PgClassExpression_358["PgClassExpression[_358∈3]<br /><__relation...ems__.#quot;id#quot;>"]:::plan
    Access_360["Access[_360∈0]<br /><_3.pgSettings>"]:::plan
    Access_361["Access[_361∈0]<br /><_3.withPgClient>"]:::plan
    Object_362["Object[_362∈0]<br /><{pgSettings,withPgClient}>"]:::plan

    %% plan dependencies
    Object_362 --> PgSelect_7
    PgSelect_7 ==> __Item_11
    __Item_11 --> PgSelectSingle_12
    PgSelectSingle_12 --> PgClassExpression_13
    PgSelectSingle_12 --> PgClassExpression_14
    Object_362 --> PgSelect_15
    PgClassExpression_14 --> PgSelect_15
    PgSelect_15 --> __ListTransform_19
    PgSelectSingle_21 -.-> __ListTransform_19
    PgSelect_15 -.-> __Item_20
    __Item_20 --> PgSelectSingle_21
    __ListTransform_19 ==> __Item_22
    __Item_22 --> PgSelectSingle_23
    PgSelectSingle_23 --> PgClassExpression_24
    PgSelectSingle_23 --> PgPolymorphic_25
    PgClassExpression_24 --> PgPolymorphic_25
    PgSelectSingle_23 --> PgClassExpression_33
    Object_362 --> PgSelect_34
    PgClassExpression_33 --> PgSelect_34
    PgSelect_34 --> First_38
    First_38 --> PgSelectSingle_39
    PgSelectSingle_39 --> PgClassExpression_40
    PgSelectSingle_39 --> PgPolymorphic_41
    PgClassExpression_40 --> PgPolymorphic_41
    PgSelectSingle_39 --> PgClassExpression_51
    PgSelectSingle_23 --> PgClassExpression_94
    PgSelectSingle_39 --> PgClassExpression_109
    PgSelectSingle_39 --> PgPolymorphic_110
    PgClassExpression_109 --> PgPolymorphic_110
    PgSelectSingle_39 --> PgClassExpression_178
    PgSelectSingle_39 --> PgPolymorphic_179
    PgClassExpression_178 --> PgPolymorphic_179
    PgSelectSingle_39 --> PgClassExpression_247
    PgSelectSingle_39 --> PgPolymorphic_248
    PgClassExpression_247 --> PgPolymorphic_248
    PgSelectSingle_23 --> PgClassExpression_302
    PgSelectSingle_39 --> PgClassExpression_316
    PgSelectSingle_39 --> PgPolymorphic_317
    PgClassExpression_316 --> PgPolymorphic_317
    PgSelectSingle_39 --> PgClassExpression_358
    __Value_3 --> Access_360
    __Value_3 --> Access_361
    Access_360 --> Object_362
    Access_361 --> Object_362

    %% plan-to-path relationships
    __Value_5 -.-> P1
    PgSelect_7 -.-> P2
    PgSelectSingle_12 -.-> P3
    PgClassExpression_13 -.-> P4
    __ListTransform_19 -.-> P5
    PgPolymorphic_25 -.-> P6
    PgPolymorphic_41 -.-> P7
    PgClassExpression_358 -.-> P8
    PgClassExpression_40 -.-> P9
    PgClassExpression_51 -.-> P10
    PgClassExpression_358 -.-> P11
    PgClassExpression_40 -.-> P12
    PgClassExpression_51 -.-> P13
    PgClassExpression_358 -.-> P14
    PgClassExpression_40 -.-> P15
    PgClassExpression_51 -.-> P16
    PgClassExpression_358 -.-> P17
    PgClassExpression_40 -.-> P18
    PgClassExpression_51 -.-> P19
    PgClassExpression_358 -.-> P20
    PgClassExpression_40 -.-> P21
    PgClassExpression_51 -.-> P22
    PgClassExpression_302 -.-> P23
    PgClassExpression_24 -.-> P24
    PgClassExpression_94 -.-> P25
    PgPolymorphic_110 -.-> P26
    PgClassExpression_358 -.-> P27
    PgClassExpression_40 -.-> P28
    PgClassExpression_51 -.-> P29
    PgClassExpression_358 -.-> P30
    PgClassExpression_40 -.-> P31
    PgClassExpression_51 -.-> P32
    PgClassExpression_358 -.-> P33
    PgClassExpression_40 -.-> P34
    PgClassExpression_51 -.-> P35
    PgClassExpression_358 -.-> P36
    PgClassExpression_40 -.-> P37
    PgClassExpression_51 -.-> P38
    PgClassExpression_358 -.-> P39
    PgClassExpression_40 -.-> P40
    PgClassExpression_51 -.-> P41
    PgClassExpression_302 -.-> P42
    PgClassExpression_24 -.-> P43
    PgClassExpression_94 -.-> P44
    PgPolymorphic_179 -.-> P45
    PgClassExpression_358 -.-> P46
    PgClassExpression_40 -.-> P47
    PgClassExpression_51 -.-> P48
    PgClassExpression_358 -.-> P49
    PgClassExpression_40 -.-> P50
    PgClassExpression_51 -.-> P51
    PgClassExpression_358 -.-> P52
    PgClassExpression_40 -.-> P53
    PgClassExpression_51 -.-> P54
    PgClassExpression_358 -.-> P55
    PgClassExpression_40 -.-> P56
    PgClassExpression_51 -.-> P57
    PgClassExpression_358 -.-> P58
    PgClassExpression_40 -.-> P59
    PgClassExpression_51 -.-> P60
    PgClassExpression_302 -.-> P61
    PgClassExpression_24 -.-> P62
    PgClassExpression_94 -.-> P63
    PgPolymorphic_248 -.-> P64
    PgClassExpression_358 -.-> P65
    PgClassExpression_40 -.-> P66
    PgClassExpression_51 -.-> P67
    PgClassExpression_358 -.-> P68
    PgClassExpression_40 -.-> P69
    PgClassExpression_51 -.-> P70
    PgClassExpression_358 -.-> P71
    PgClassExpression_40 -.-> P72
    PgClassExpression_51 -.-> P73
    PgClassExpression_358 -.-> P74
    PgClassExpression_40 -.-> P75
    PgClassExpression_51 -.-> P76
    PgClassExpression_358 -.-> P77
    PgClassExpression_40 -.-> P78
    PgClassExpression_51 -.-> P79
    PgClassExpression_302 -.-> P80
    PgClassExpression_24 -.-> P81
    PgClassExpression_94 -.-> P82
    PgPolymorphic_317 -.-> P83
    PgClassExpression_358 -.-> P84
    PgClassExpression_40 -.-> P85
    PgClassExpression_51 -.-> P86
    PgClassExpression_358 -.-> P87
    PgClassExpression_40 -.-> P88
    PgClassExpression_51 -.-> P89
    PgClassExpression_358 -.-> P90
    PgClassExpression_40 -.-> P91
    PgClassExpression_51 -.-> P92
    PgClassExpression_358 -.-> P93
    PgClassExpression_40 -.-> P94
    PgClassExpression_51 -.-> P95
    PgClassExpression_358 -.-> P96
    PgClassExpression_40 -.-> P97
    PgClassExpression_51 -.-> P98
    PgClassExpression_302 -.-> P99
    PgClassExpression_24 -.-> P100
    PgClassExpression_94 -.-> P101

    %% allocate buckets
    classDef bucket0 stroke:#696969
    class __Value_3,__Value_5,PgSelect_7,Access_360,Access_361,Object_362 bucket0
    classDef bucket1 stroke:#a52a2a
    class __Item_11,PgSelectSingle_12,PgClassExpression_13,PgClassExpression_14,PgSelect_15,__ListTransform_19 bucket1
    classDef bucket2 stroke:#808000
    class __Item_20,PgSelectSingle_21 bucket2
    classDef bucket3 stroke:#3cb371
    class __Item_22,PgSelectSingle_23,PgClassExpression_24,PgPolymorphic_25,PgClassExpression_33,PgSelect_34,First_38,PgSelectSingle_39,PgClassExpression_40,PgPolymorphic_41,PgClassExpression_51,PgClassExpression_94,PgClassExpression_109,PgPolymorphic_110,PgClassExpression_178,PgPolymorphic_179,PgClassExpression_247,PgPolymorphic_248,PgClassExpression_302,PgClassExpression_316,PgPolymorphic_317,PgClassExpression_358 bucket3
```
