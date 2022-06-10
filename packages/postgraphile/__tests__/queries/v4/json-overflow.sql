with __local_0__ as (
  select to_json(
    (
      (
        jsonb_build_object(
          '__identifiers'::text,
          json_build_array(__local_1__."id"),
          'headline'::text,
          (__local_1__."headline"),
          '@a1'::text,
          (
            select to_json(__local_2__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $1
            ) as __local_2__
            where (TRUE) and (TRUE)
          ),
          '@a2'::text,
          (
            select to_json(__local_3__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $2
            ) as __local_3__
            where (TRUE) and (TRUE)
          ),
          '@a3'::text,
          (
            select to_json(__local_4__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $3
            ) as __local_4__
            where (TRUE) and (TRUE)
          ),
          '@a4'::text,
          (
            select to_json(__local_5__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $4
            ) as __local_5__
            where (TRUE) and (TRUE)
          ),
          '@a5'::text,
          (
            select to_json(__local_6__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $5
            ) as __local_6__
            where (TRUE) and (TRUE)
          ),
          '@a6'::text,
          (
            select to_json(__local_7__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $6
            ) as __local_7__
            where (TRUE) and (TRUE)
          ),
          '@a7'::text,
          (
            select to_json(__local_8__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $7
            ) as __local_8__
            where (TRUE) and (TRUE)
          ),
          '@a8'::text,
          (
            select to_json(__local_9__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $8
            ) as __local_9__
            where (TRUE) and (TRUE)
          ),
          '@a9'::text,
          (
            select to_json(__local_10__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $9
            ) as __local_10__
            where (TRUE) and (TRUE)
          ),
          '@a10'::text,
          (
            select to_json(__local_11__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $10
            ) as __local_11__
            where (TRUE) and (TRUE)
          ),
          '@a11'::text,
          (
            select to_json(__local_12__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $11
            ) as __local_12__
            where (TRUE) and (TRUE)
          ),
          '@a12'::text,
          (
            select to_json(__local_13__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $12
            ) as __local_13__
            where (TRUE) and (TRUE)
          ),
          '@a13'::text,
          (
            select to_json(__local_14__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $13
            ) as __local_14__
            where (TRUE) and (TRUE)
          ),
          '@a14'::text,
          (
            select to_json(__local_15__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $14
            ) as __local_15__
            where (TRUE) and (TRUE)
          ),
          '@a15'::text,
          (
            select to_json(__local_16__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $15
            ) as __local_16__
            where (TRUE) and (TRUE)
          ),
          '@a16'::text,
          (
            select to_json(__local_17__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $16
            ) as __local_17__
            where (TRUE) and (TRUE)
          ),
          '@a17'::text,
          (
            select to_json(__local_18__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $17
            ) as __local_18__
            where (TRUE) and (TRUE)
          ),
          '@a18'::text,
          (
            select to_json(__local_19__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $18
            ) as __local_19__
            where (TRUE) and (TRUE)
          ),
          '@a19'::text,
          (
            select to_json(__local_20__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $19
            ) as __local_20__
            where (TRUE) and (TRUE)
          ),
          '@a20'::text,
          (
            select to_json(__local_21__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $20
            ) as __local_21__
            where (TRUE) and (TRUE)
          ),
          '@a21'::text,
          (
            select to_json(__local_22__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $21
            ) as __local_22__
            where (TRUE) and (TRUE)
          ),
          '@a22'::text,
          (
            select to_json(__local_23__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $22
            ) as __local_23__
            where (TRUE) and (TRUE)
          ),
          '@a23'::text,
          (
            select to_json(__local_24__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $23
            ) as __local_24__
            where (TRUE) and (TRUE)
          ),
          '@a24'::text,
          (
            select to_json(__local_25__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $24
            ) as __local_25__
            where (TRUE) and (TRUE)
          ),
          '@a25'::text,
          (
            select to_json(__local_26__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $25
            ) as __local_26__
            where (TRUE) and (TRUE)
          ),
          '@a26'::text,
          (
            select to_json(__local_27__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $26
            ) as __local_27__
            where (TRUE) and (TRUE)
          ),
          '@a27'::text,
          (
            select to_json(__local_28__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $27
            ) as __local_28__
            where (TRUE) and (TRUE)
          ),
          '@a28'::text,
          (
            select to_json(__local_29__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $28
            ) as __local_29__
            where (TRUE) and (TRUE)
          ),
          '@a29'::text,
          (
            select to_json(__local_30__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $29
            ) as __local_30__
            where (TRUE) and (TRUE)
          ),
          '@a30'::text,
          (
            select to_json(__local_31__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $30
            ) as __local_31__
            where (TRUE) and (TRUE)
          ),
          '@a31'::text,
          (
            select to_json(__local_32__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $31
            ) as __local_32__
            where (TRUE) and (TRUE)
          ),
          '@a32'::text,
          (
            select to_json(__local_33__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $32
            ) as __local_33__
            where (TRUE) and (TRUE)
          ),
          '@a33'::text,
          (
            select to_json(__local_34__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $33
            ) as __local_34__
            where (TRUE) and (TRUE)
          ),
          '@a34'::text,
          (
            select to_json(__local_35__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $34
            ) as __local_35__
            where (TRUE) and (TRUE)
          ),
          '@a35'::text,
          (
            select to_json(__local_36__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $35
            ) as __local_36__
            where (TRUE) and (TRUE)
          ),
          '@a36'::text,
          (
            select to_json(__local_37__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $36
            ) as __local_37__
            where (TRUE) and (TRUE)
          ),
          '@a37'::text,
          (
            select to_json(__local_38__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $37
            ) as __local_38__
            where (TRUE) and (TRUE)
          ),
          '@a38'::text,
          (
            select to_json(__local_39__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $38
            ) as __local_39__
            where (TRUE) and (TRUE)
          ),
          '@a39'::text,
          (
            select to_json(__local_40__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $39
            ) as __local_40__
            where (TRUE) and (TRUE)
          ),
          '@a40'::text,
          (
            select to_json(__local_41__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $40
            ) as __local_41__
            where (TRUE) and (TRUE)
          ),
          '@a41'::text,
          (
            select to_json(__local_42__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $41
            ) as __local_42__
            where (TRUE) and (TRUE)
          ),
          '@a42'::text,
          (
            select to_json(__local_43__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $42
            ) as __local_43__
            where (TRUE) and (TRUE)
          ),
          '@a43'::text,
          (
            select to_json(__local_44__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $43
            ) as __local_44__
            where (TRUE) and (TRUE)
          ),
          '@a44'::text,
          (
            select to_json(__local_45__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $44
            ) as __local_45__
            where (TRUE) and (TRUE)
          ),
          '@a45'::text,
          (
            select to_json(__local_46__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $45
            ) as __local_46__
            where (TRUE) and (TRUE)
          ),
          '@a46'::text,
          (
            select to_json(__local_47__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $46
            ) as __local_47__
            where (TRUE) and (TRUE)
          ),
          '@a47'::text,
          (
            select to_json(__local_48__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $47
            ) as __local_48__
            where (TRUE) and (TRUE)
          ),
          '@a48'::text,
          (
            select to_json(__local_49__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $48
            ) as __local_49__
            where (TRUE) and (TRUE)
          )
        ) || jsonb_build_object(
          '@a49'::text,
          (
            select to_json(__local_50__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $49
            ) as __local_50__
            where (TRUE) and (TRUE)
          ),
          '@a50'::text,
          (
            select to_json(__local_51__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $50
            ) as __local_51__
            where (TRUE) and (TRUE)
          ),
          '@a51'::text,
          (
            select to_json(__local_52__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $51
            ) as __local_52__
            where (TRUE) and (TRUE)
          ),
          '@a52'::text,
          (
            select to_json(__local_53__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $52
            ) as __local_53__
            where (TRUE) and (TRUE)
          ),
          '@a53'::text,
          (
            select to_json(__local_54__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $53
            ) as __local_54__
            where (TRUE) and (TRUE)
          ),
          '@a54'::text,
          (
            select to_json(__local_55__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $54
            ) as __local_55__
            where (TRUE) and (TRUE)
          ),
          '@a55'::text,
          (
            select to_json(__local_56__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $55
            ) as __local_56__
            where (TRUE) and (TRUE)
          ),
          '@a56'::text,
          (
            select to_json(__local_57__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $56
            ) as __local_57__
            where (TRUE) and (TRUE)
          ),
          '@a57'::text,
          (
            select to_json(__local_58__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $57
            ) as __local_58__
            where (TRUE) and (TRUE)
          ),
          '@a58'::text,
          (
            select to_json(__local_59__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $58
            ) as __local_59__
            where (TRUE) and (TRUE)
          ),
          '@a59'::text,
          (
            select to_json(__local_60__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $59
            ) as __local_60__
            where (TRUE) and (TRUE)
          ),
          '@a60'::text,
          (
            select to_json(__local_61__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $60
            ) as __local_61__
            where (TRUE) and (TRUE)
          ),
          '@a61'::text,
          (
            select to_json(__local_62__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $61
            ) as __local_62__
            where (TRUE) and (TRUE)
          ),
          '@a62'::text,
          (
            select to_json(__local_63__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $62
            ) as __local_63__
            where (TRUE) and (TRUE)
          ),
          '@a63'::text,
          (
            select to_json(__local_64__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $63
            ) as __local_64__
            where (TRUE) and (TRUE)
          ),
          '@a64'::text,
          (
            select to_json(__local_65__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $64
            ) as __local_65__
            where (TRUE) and (TRUE)
          ),
          '@a65'::text,
          (
            select to_json(__local_66__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $65
            ) as __local_66__
            where (TRUE) and (TRUE)
          ),
          '@a66'::text,
          (
            select to_json(__local_67__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $66
            ) as __local_67__
            where (TRUE) and (TRUE)
          ),
          '@a67'::text,
          (
            select to_json(__local_68__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $67
            ) as __local_68__
            where (TRUE) and (TRUE)
          ),
          '@a68'::text,
          (
            select to_json(__local_69__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $68
            ) as __local_69__
            where (TRUE) and (TRUE)
          ),
          '@a69'::text,
          (
            select to_json(__local_70__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $69
            ) as __local_70__
            where (TRUE) and (TRUE)
          ),
          '@a70'::text,
          (
            select to_json(__local_71__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $70
            ) as __local_71__
            where (TRUE) and (TRUE)
          ),
          '@a71'::text,
          (
            select to_json(__local_72__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $71
            ) as __local_72__
            where (TRUE) and (TRUE)
          ),
          '@a72'::text,
          (
            select to_json(__local_73__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $72
            ) as __local_73__
            where (TRUE) and (TRUE)
          ),
          '@a73'::text,
          (
            select to_json(__local_74__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $73
            ) as __local_74__
            where (TRUE) and (TRUE)
          ),
          '@a74'::text,
          (
            select to_json(__local_75__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $74
            ) as __local_75__
            where (TRUE) and (TRUE)
          ),
          '@a75'::text,
          (
            select to_json(__local_76__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $75
            ) as __local_76__
            where (TRUE) and (TRUE)
          ),
          '@a76'::text,
          (
            select to_json(__local_77__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $76
            ) as __local_77__
            where (TRUE) and (TRUE)
          ),
          '@a77'::text,
          (
            select to_json(__local_78__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $77
            ) as __local_78__
            where (TRUE) and (TRUE)
          ),
          '@a78'::text,
          (
            select to_json(__local_79__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $78
            ) as __local_79__
            where (TRUE) and (TRUE)
          ),
          '@a79'::text,
          (
            select to_json(__local_80__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $79
            ) as __local_80__
            where (TRUE) and (TRUE)
          ),
          '@a80'::text,
          (
            select to_json(__local_81__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $80
            ) as __local_81__
            where (TRUE) and (TRUE)
          ),
          '@a81'::text,
          (
            select to_json(__local_82__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $81
            ) as __local_82__
            where (TRUE) and (TRUE)
          ),
          '@a82'::text,
          (
            select to_json(__local_83__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $82
            ) as __local_83__
            where (TRUE) and (TRUE)
          ),
          '@a83'::text,
          (
            select to_json(__local_84__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $83
            ) as __local_84__
            where (TRUE) and (TRUE)
          ),
          '@a84'::text,
          (
            select to_json(__local_85__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $84
            ) as __local_85__
            where (TRUE) and (TRUE)
          ),
          '@a85'::text,
          (
            select to_json(__local_86__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $85
            ) as __local_86__
            where (TRUE) and (TRUE)
          ),
          '@a86'::text,
          (
            select to_json(__local_87__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $86
            ) as __local_87__
            where (TRUE) and (TRUE)
          ),
          '@a87'::text,
          (
            select to_json(__local_88__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $87
            ) as __local_88__
            where (TRUE) and (TRUE)
          ),
          '@a88'::text,
          (
            select to_json(__local_89__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $88
            ) as __local_89__
            where (TRUE) and (TRUE)
          ),
          '@a89'::text,
          (
            select to_json(__local_90__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $89
            ) as __local_90__
            where (TRUE) and (TRUE)
          ),
          '@a90'::text,
          (
            select to_json(__local_91__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $90
            ) as __local_91__
            where (TRUE) and (TRUE)
          ),
          '@a91'::text,
          (
            select to_json(__local_92__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $91
            ) as __local_92__
            where (TRUE) and (TRUE)
          ),
          '@a92'::text,
          (
            select to_json(__local_93__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $92
            ) as __local_93__
            where (TRUE) and (TRUE)
          ),
          '@a93'::text,
          (
            select to_json(__local_94__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $93
            ) as __local_94__
            where (TRUE) and (TRUE)
          ),
          '@a94'::text,
          (
            select to_json(__local_95__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $94
            ) as __local_95__
            where (TRUE) and (TRUE)
          ),
          '@a95'::text,
          (
            select to_json(__local_96__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $95
            ) as __local_96__
            where (TRUE) and (TRUE)
          ),
          '@a96'::text,
          (
            select to_json(__local_97__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $96
            ) as __local_97__
            where (TRUE) and (TRUE)
          ),
          '@a97'::text,
          (
            select to_json(__local_98__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $97
            ) as __local_98__
            where (TRUE) and (TRUE)
          ),
          '@a98'::text,
          (
            select to_json(__local_99__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $98
            ) as __local_99__
            where (TRUE) and (TRUE)
          )
        ) || jsonb_build_object(
          '@a99'::text,
          (
            select to_json(__local_100__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $99
            ) as __local_100__
            where (TRUE) and (TRUE)
          ),
          '@a100'::text,
          (
            select to_json(__local_101__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $100
            ) as __local_101__
            where (TRUE) and (TRUE)
          ),
          '@a101'::text,
          (
            select to_json(__local_102__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $101
            ) as __local_102__
            where (TRUE) and (TRUE)
          ),
          '@a102'::text,
          (
            select to_json(__local_103__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $102
            ) as __local_103__
            where (TRUE) and (TRUE)
          ),
          '@a103'::text,
          (
            select to_json(__local_104__) as "value"
            from "a"."post_headline_trimmed"(
              __local_1__,
              "length" := $103
            ) as __local_104__
            where (TRUE) and (TRUE)
          )
        )
      )::json
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "a"."post" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
    limit 1
  ) __local_1__
),
__local_105__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_105__.data
    from __local_105__
  ),
  '[]'::json
) as "data"