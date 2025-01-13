select __person_result__.*
from (select 0 as idx) as __person_identifiers__,
lateral (
  select
    (select json_agg(s) from (
      select
        __post__."headline" as "0",
        "a"."post_headline_trimmed"(
          __post__,
          $1::"int4"
        ) as "1",
        "a"."post_headline_trimmed"(
          __post__,
          $2::"int4"
        ) as "2",
        "a"."post_headline_trimmed"(
          __post__,
          $3::"int4"
        ) as "3",
        "a"."post_headline_trimmed"(
          __post__,
          $4::"int4"
        ) as "4",
        "a"."post_headline_trimmed"(
          __post__,
          $5::"int4"
        ) as "5",
        "a"."post_headline_trimmed"(
          __post__,
          $6::"int4"
        ) as "6",
        "a"."post_headline_trimmed"(
          __post__,
          $7::"int4"
        ) as "7",
        "a"."post_headline_trimmed"(
          __post__,
          $8::"int4"
        ) as "8",
        "a"."post_headline_trimmed"(
          __post__,
          $9::"int4"
        ) as "9",
        "a"."post_headline_trimmed"(
          __post__,
          $10::"int4"
        ) as "10",
        "a"."post_headline_trimmed"(
          __post__,
          $11::"int4"
        ) as "11",
        "a"."post_headline_trimmed"(
          __post__,
          $12::"int4"
        ) as "12",
        "a"."post_headline_trimmed"(
          __post__,
          $13::"int4"
        ) as "13",
        "a"."post_headline_trimmed"(
          __post__,
          $14::"int4"
        ) as "14",
        "a"."post_headline_trimmed"(
          __post__,
          $15::"int4"
        ) as "15",
        "a"."post_headline_trimmed"(
          __post__,
          $16::"int4"
        ) as "16",
        "a"."post_headline_trimmed"(
          __post__,
          $17::"int4"
        ) as "17",
        "a"."post_headline_trimmed"(
          __post__,
          $18::"int4"
        ) as "18",
        "a"."post_headline_trimmed"(
          __post__,
          $19::"int4"
        ) as "19",
        "a"."post_headline_trimmed"(
          __post__,
          $20::"int4"
        ) as "20",
        "a"."post_headline_trimmed"(
          __post__,
          $21::"int4"
        ) as "21",
        "a"."post_headline_trimmed"(
          __post__,
          $22::"int4"
        ) as "22",
        "a"."post_headline_trimmed"(
          __post__,
          $23::"int4"
        ) as "23",
        "a"."post_headline_trimmed"(
          __post__,
          $24::"int4"
        ) as "24",
        "a"."post_headline_trimmed"(
          __post__,
          $25::"int4"
        ) as "25",
        "a"."post_headline_trimmed"(
          __post__,
          $26::"int4"
        ) as "26",
        "a"."post_headline_trimmed"(
          __post__,
          $27::"int4"
        ) as "27",
        "a"."post_headline_trimmed"(
          __post__,
          $28::"int4"
        ) as "28",
        "a"."post_headline_trimmed"(
          __post__,
          $29::"int4"
        ) as "29",
        "a"."post_headline_trimmed"(
          __post__,
          $30::"int4"
        ) as "30",
        "a"."post_headline_trimmed"(
          __post__,
          $31::"int4"
        ) as "31",
        "a"."post_headline_trimmed"(
          __post__,
          $32::"int4"
        ) as "32",
        "a"."post_headline_trimmed"(
          __post__,
          $33::"int4"
        ) as "33",
        "a"."post_headline_trimmed"(
          __post__,
          $34::"int4"
        ) as "34",
        "a"."post_headline_trimmed"(
          __post__,
          $35::"int4"
        ) as "35",
        "a"."post_headline_trimmed"(
          __post__,
          $36::"int4"
        ) as "36",
        "a"."post_headline_trimmed"(
          __post__,
          $37::"int4"
        ) as "37",
        "a"."post_headline_trimmed"(
          __post__,
          $38::"int4"
        ) as "38",
        "a"."post_headline_trimmed"(
          __post__,
          $39::"int4"
        ) as "39",
        "a"."post_headline_trimmed"(
          __post__,
          $40::"int4"
        ) as "40",
        "a"."post_headline_trimmed"(
          __post__,
          $41::"int4"
        ) as "41",
        "a"."post_headline_trimmed"(
          __post__,
          $42::"int4"
        ) as "42",
        "a"."post_headline_trimmed"(
          __post__,
          $43::"int4"
        ) as "43",
        "a"."post_headline_trimmed"(
          __post__,
          $44::"int4"
        ) as "44",
        "a"."post_headline_trimmed"(
          __post__,
          $45::"int4"
        ) as "45",
        "a"."post_headline_trimmed"(
          __post__,
          $46::"int4"
        ) as "46",
        "a"."post_headline_trimmed"(
          __post__,
          $47::"int4"
        ) as "47",
        "a"."post_headline_trimmed"(
          __post__,
          $48::"int4"
        ) as "48",
        "a"."post_headline_trimmed"(
          __post__,
          $49::"int4"
        ) as "49",
        "a"."post_headline_trimmed"(
          __post__,
          $50::"int4"
        ) as "50",
        "a"."post_headline_trimmed"(
          __post__,
          $51::"int4"
        ) as "51",
        "a"."post_headline_trimmed"(
          __post__,
          $52::"int4"
        ) as "52",
        "a"."post_headline_trimmed"(
          __post__,
          $53::"int4"
        ) as "53",
        "a"."post_headline_trimmed"(
          __post__,
          $54::"int4"
        ) as "54",
        "a"."post_headline_trimmed"(
          __post__,
          $55::"int4"
        ) as "55",
        "a"."post_headline_trimmed"(
          __post__,
          $56::"int4"
        ) as "56",
        "a"."post_headline_trimmed"(
          __post__,
          $57::"int4"
        ) as "57",
        "a"."post_headline_trimmed"(
          __post__,
          $58::"int4"
        ) as "58",
        "a"."post_headline_trimmed"(
          __post__,
          $59::"int4"
        ) as "59",
        "a"."post_headline_trimmed"(
          __post__,
          $60::"int4"
        ) as "60",
        "a"."post_headline_trimmed"(
          __post__,
          $61::"int4"
        ) as "61",
        "a"."post_headline_trimmed"(
          __post__,
          $62::"int4"
        ) as "62",
        "a"."post_headline_trimmed"(
          __post__,
          $63::"int4"
        ) as "63",
        "a"."post_headline_trimmed"(
          __post__,
          $64::"int4"
        ) as "64",
        "a"."post_headline_trimmed"(
          __post__,
          $65::"int4"
        ) as "65",
        "a"."post_headline_trimmed"(
          __post__,
          $66::"int4"
        ) as "66",
        "a"."post_headline_trimmed"(
          __post__,
          $67::"int4"
        ) as "67",
        "a"."post_headline_trimmed"(
          __post__,
          $68::"int4"
        ) as "68",
        "a"."post_headline_trimmed"(
          __post__,
          $69::"int4"
        ) as "69",
        "a"."post_headline_trimmed"(
          __post__,
          $70::"int4"
        ) as "70",
        "a"."post_headline_trimmed"(
          __post__,
          $71::"int4"
        ) as "71",
        "a"."post_headline_trimmed"(
          __post__,
          $72::"int4"
        ) as "72",
        "a"."post_headline_trimmed"(
          __post__,
          $73::"int4"
        ) as "73",
        "a"."post_headline_trimmed"(
          __post__,
          $74::"int4"
        ) as "74",
        "a"."post_headline_trimmed"(
          __post__,
          $75::"int4"
        ) as "75",
        "a"."post_headline_trimmed"(
          __post__,
          $76::"int4"
        ) as "76",
        "a"."post_headline_trimmed"(
          __post__,
          $77::"int4"
        ) as "77",
        "a"."post_headline_trimmed"(
          __post__,
          $78::"int4"
        ) as "78",
        "a"."post_headline_trimmed"(
          __post__,
          $79::"int4"
        ) as "79",
        "a"."post_headline_trimmed"(
          __post__,
          $80::"int4"
        ) as "80",
        "a"."post_headline_trimmed"(
          __post__,
          $81::"int4"
        ) as "81",
        "a"."post_headline_trimmed"(
          __post__,
          $82::"int4"
        ) as "82",
        "a"."post_headline_trimmed"(
          __post__,
          $83::"int4"
        ) as "83",
        "a"."post_headline_trimmed"(
          __post__,
          $84::"int4"
        ) as "84",
        "a"."post_headline_trimmed"(
          __post__,
          $85::"int4"
        ) as "85",
        "a"."post_headline_trimmed"(
          __post__,
          $86::"int4"
        ) as "86",
        "a"."post_headline_trimmed"(
          __post__,
          $87::"int4"
        ) as "87",
        "a"."post_headline_trimmed"(
          __post__,
          $88::"int4"
        ) as "88",
        "a"."post_headline_trimmed"(
          __post__,
          $89::"int4"
        ) as "89",
        "a"."post_headline_trimmed"(
          __post__,
          $90::"int4"
        ) as "90",
        "a"."post_headline_trimmed"(
          __post__,
          $91::"int4"
        ) as "91",
        "a"."post_headline_trimmed"(
          __post__,
          $92::"int4"
        ) as "92",
        "a"."post_headline_trimmed"(
          __post__,
          $93::"int4"
        ) as "93",
        "a"."post_headline_trimmed"(
          __post__,
          $94::"int4"
        ) as "94",
        "a"."post_headline_trimmed"(
          __post__,
          $95::"int4"
        ) as "95",
        "a"."post_headline_trimmed"(
          __post__,
          $96::"int4"
        ) as "96",
        "a"."post_headline_trimmed"(
          __post__,
          $97::"int4"
        ) as "97",
        "a"."post_headline_trimmed"(
          __post__,
          $98::"int4"
        ) as "98",
        "a"."post_headline_trimmed"(
          __post__,
          $99::"int4"
        ) as "99",
        "a"."post_headline_trimmed"(
          __post__,
          $100::"int4"
        ) as "100",
        "a"."post_headline_trimmed"(
          __post__,
          $101::"int4"
        ) as "101",
        "a"."post_headline_trimmed"(
          __post__,
          $102::"int4"
        ) as "102",
        "a"."post_headline_trimmed"(
          __post__,
          $103::"int4"
        ) as "103"
      from "a"."post" as __post__
      where (
        __person__."id"::"int4" = __post__."author_id"
      )
      order by __post__."id" asc
      limit 1
    ) s) as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  order by __person__."id" asc
  limit 1
) as __person_result__;