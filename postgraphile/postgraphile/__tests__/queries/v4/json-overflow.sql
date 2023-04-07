select __post_result__.*
from (select 0 as idx, $1::"int4" as "id0", $2::"int4" as "id1", $3::"int4" as "id2", $4::"int4" as "id3", $5::"int4" as "id4", $6::"int4" as "id5", $7::"int4" as "id6", $8::"int4" as "id7", $9::"int4" as "id8", $10::"int4" as "id9", $11::"int4" as "id10", $12::"int4" as "id11", $13::"int4" as "id12", $14::"int4" as "id13", $15::"int4" as "id14", $16::"int4" as "id15", $17::"int4" as "id16", $18::"int4" as "id17", $19::"int4" as "id18", $20::"int4" as "id19", $21::"int4" as "id20", $22::"int4" as "id21", $23::"int4" as "id22", $24::"int4" as "id23", $25::"int4" as "id24", $26::"int4" as "id25", $27::"int4" as "id26", $28::"int4" as "id27", $29::"int4" as "id28", $30::"int4" as "id29", $31::"int4" as "id30", $32::"int4" as "id31", $33::"int4" as "id32", $34::"int4" as "id33", $35::"int4" as "id34", $36::"int4" as "id35", $37::"int4" as "id36", $38::"int4" as "id37", $39::"int4" as "id38", $40::"int4" as "id39", $41::"int4" as "id40", $42::"int4" as "id41", $43::"int4" as "id42", $44::"int4" as "id43", $45::"int4" as "id44", $46::"int4" as "id45", $47::"int4" as "id46", $48::"int4" as "id47", $49::"int4" as "id48", $50::"int4" as "id49", $51::"int4" as "id50", $52::"int4" as "id51", $53::"int4" as "id52", $54::"int4" as "id53", $55::"int4" as "id54", $56::"int4" as "id55", $57::"int4" as "id56", $58::"int4" as "id57", $59::"int4" as "id58", $60::"int4" as "id59", $61::"int4" as "id60", $62::"int4" as "id61", $63::"int4" as "id62", $64::"int4" as "id63", $65::"int4" as "id64", $66::"int4" as "id65", $67::"int4" as "id66", $68::"int4" as "id67", $69::"int4" as "id68", $70::"int4" as "id69", $71::"int4" as "id70", $72::"int4" as "id71", $73::"int4" as "id72", $74::"int4" as "id73", $75::"int4" as "id74", $76::"int4" as "id75", $77::"int4" as "id76", $78::"int4" as "id77", $79::"int4" as "id78", $80::"int4" as "id79", $81::"int4" as "id80", $82::"int4" as "id81", $83::"int4" as "id82", $84::"int4" as "id83", $85::"int4" as "id84", $86::"int4" as "id85", $87::"int4" as "id86", $88::"int4" as "id87", $89::"int4" as "id88", $90::"int4" as "id89", $91::"int4" as "id90", $92::"int4" as "id91", $93::"int4" as "id92", $94::"int4" as "id93", $95::"int4" as "id94", $96::"int4" as "id95", $97::"int4" as "id96", $98::"int4" as "id97", $99::"int4" as "id98", $100::"int4" as "id99", $101::"int4" as "id100", $102::"int4" as "id101", $103::"int4" as "id102") as __post_identifiers__,
lateral (
  select
    __post__."headline" as "0",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id0"
    ) as "1",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id1"
    ) as "2",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id2"
    ) as "3",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id3"
    ) as "4",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id4"
    ) as "5",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id5"
    ) as "6",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id6"
    ) as "7",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id7"
    ) as "8",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id8"
    ) as "9",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id9"
    ) as "10",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id10"
    ) as "11",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id11"
    ) as "12",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id12"
    ) as "13",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id13"
    ) as "14",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id14"
    ) as "15",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id15"
    ) as "16",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id16"
    ) as "17",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id17"
    ) as "18",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id18"
    ) as "19",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id19"
    ) as "20",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id20"
    ) as "21",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id21"
    ) as "22",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id22"
    ) as "23",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id23"
    ) as "24",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id24"
    ) as "25",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id25"
    ) as "26",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id26"
    ) as "27",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id27"
    ) as "28",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id28"
    ) as "29",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id29"
    ) as "30",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id30"
    ) as "31",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id31"
    ) as "32",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id32"
    ) as "33",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id33"
    ) as "34",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id34"
    ) as "35",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id35"
    ) as "36",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id36"
    ) as "37",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id37"
    ) as "38",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id38"
    ) as "39",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id39"
    ) as "40",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id40"
    ) as "41",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id41"
    ) as "42",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id42"
    ) as "43",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id43"
    ) as "44",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id44"
    ) as "45",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id45"
    ) as "46",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id46"
    ) as "47",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id47"
    ) as "48",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id48"
    ) as "49",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id49"
    ) as "50",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id50"
    ) as "51",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id51"
    ) as "52",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id52"
    ) as "53",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id53"
    ) as "54",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id54"
    ) as "55",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id55"
    ) as "56",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id56"
    ) as "57",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id57"
    ) as "58",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id58"
    ) as "59",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id59"
    ) as "60",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id60"
    ) as "61",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id61"
    ) as "62",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id62"
    ) as "63",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id63"
    ) as "64",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id64"
    ) as "65",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id65"
    ) as "66",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id66"
    ) as "67",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id67"
    ) as "68",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id68"
    ) as "69",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id69"
    ) as "70",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id70"
    ) as "71",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id71"
    ) as "72",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id72"
    ) as "73",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id73"
    ) as "74",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id74"
    ) as "75",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id75"
    ) as "76",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id76"
    ) as "77",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id77"
    ) as "78",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id78"
    ) as "79",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id79"
    ) as "80",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id80"
    ) as "81",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id81"
    ) as "82",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id82"
    ) as "83",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id83"
    ) as "84",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id84"
    ) as "85",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id85"
    ) as "86",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id86"
    ) as "87",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id87"
    ) as "88",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id88"
    ) as "89",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id89"
    ) as "90",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id90"
    ) as "91",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id91"
    ) as "92",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id92"
    ) as "93",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id93"
    ) as "94",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id94"
    ) as "95",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id95"
    ) as "96",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id96"
    ) as "97",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id97"
    ) as "98",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id98"
    ) as "99",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id99"
    ) as "100",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id100"
    ) as "101",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id101"
    ) as "102",
    "a"."post_headline_trimmed"(
      __post__,
      __post_identifiers__."id102"
    ) as "103",
    __post_identifiers__.idx as "104"
  from "a"."post" as __post__
  order by __post__."id" asc
  limit 1
) as __post_result__;