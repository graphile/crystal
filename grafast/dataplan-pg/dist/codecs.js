"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
exports.recordCodec = recordCodec;
exports.enumCodec = enumCodec;
exports.isEnumCodec = isEnumCodec;
exports.listOfCodec = listOfCodec;
exports.domainOfCodec = domainOfCodec;
exports.rangeOfCodec = rangeOfCodec;
exports.getCodecByPgCatalogTypeName = getCodecByPgCatalogTypeName;
exports.getInnerCodec = getInnerCodec;
exports.sqlValueWithCodec = sqlValueWithCodec;
const tslib_1 = require("tslib");
const grafast_1 = require("grafast");
const pg_sql2_1 = tslib_1.__importDefault(require("pg-sql2"));
const postgres_range_1 = require("postgres-range");
const index_js_1 = require("./codecUtils/index.js");
const inspect_js_1 = require("./inspect.js");
const parseArray_js_1 = require("./parseArray.js");
// PERF: `identity` can be shortcut
const identity = (value) => value;
/**
 * Returns a PgCodec for the given builtin Postgres scalar type, optionally
 * pass the following config:
 *
 * - castFromPg: how to wrap the SQL fragment that represents this type so that
 *   it's cast to a suitable type for us to receive via the relevant Postgres
 *   driver
 * - listCastFromPg: as castFromPg, but for usage when the expression type is a
 *   list of this type
 * - fromPg: parse the value from Postgres into JS format
 * - toPg: serialize the value from JS into a format Postgres will understand
 *
 * param type - the name of the Postgres type - see the `pg_type` table
 * param options - the configuration options described above
 */
function t() {
    return (oid, type, options = {}) => {
        const { castFromPg, listCastFromPg, fromPg, toPg, isBinary } = options;
        return {
            name: type,
            sqlType: pg_sql2_1.default.identifier(...type.split(".")),
            fromPg: fromPg ?? identity,
            toPg: toPg ?? identity,
            attributes: undefined,
            extensions: { oid: oid },
            castFromPg,
            listCastFromPg,
            executor: null,
            isBinary,
            [inspect_js_1.inspect.custom]: codecInspect,
        };
    };
}
/**
 * | To put a double quote or backslash in a quoted composite field value,
 * | precede it with a backslash.
 */
function pgWrapQuotesInCompositeValue(str) {
    return `"${str.replace(/["\\]/g, "\\$&")}"`;
}
function toRecordString(val) {
    if (val == null) {
        return "";
    }
    else if (typeof val === "boolean") {
        return val ? "t" : "f";
    }
    else if (typeof val === "number") {
        return "" + val;
    }
    else if (
    // essentially Array.isArray in this context
    typeof val === "object") {
        const parts = val.map((v) => toListString(v));
        return `{${parts.join(",")}}`;
    }
    else if (/[(),"\\]/.test(val) || val.length === 0) {
        /*
         * The Postgres manual states:
         *
         * > You can put double quotes around any field value, and must do so if
         * > it contains commas or parentheses.
         *
         * Also:
         *
         * > In particular, fields containing parentheses, commas, double quotes,
         * > or backslashes must be double-quoted. [...] Alternatively, you can
         * > avoid quoting and use backslash-escaping to protect all data
         * > characters that would otherwise be taken as composite syntax.
         *
         * We're going to go with double quoting.
         */
        return pgWrapQuotesInCompositeValue(val);
    }
    else {
        return "" + val;
    }
}
function pgWrapQuotesInArray(str) {
    return `"${str.replace(/["\\]/g, "\\$&")}"`;
}
function toListString(val) {
    if (val == null) {
        return "NULL";
    }
    else if (typeof val === "boolean") {
        return val ? "t" : "f";
    }
    else if (typeof val === "number") {
        return "" + val;
    }
    else if (
    // essentially Array.isArray in this context
    typeof val === "object") {
        const parts = val.map((v) => toListString(v));
        return `{${parts.join(",")}}`;
    }
    else {
        return pgWrapQuotesInArray(val);
    }
}
// TESTS: this needs unit tests!
/**
 * Parses a PostgreSQL record string (e.g. `(1,2,   hi)`) into a tuple (e.g.
 * `["1", "2", "   hi"]`).
 *
 * Postgres says:
 *
 * | The composite output routine will put double quotes around field values if
 * | they are empty strings or contain parentheses, commas, double quotes,
 * | backslashes, or white space. (Doing so for white space is not essential,
 * | but aids legibility.) Double quotes and backslashes embedded in field
 * | values will be doubled.
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function recordStringToTuple(value) {
    if (!value.startsWith("(") || !value.endsWith(")")) {
        throw new Error(`Unsupported record string '${value}'`);
    }
    let inQuotes = false;
    let current = null;
    const tuple = [];
    // We only need to loop inside the parenthesis. Whitespace is significant in here.
    for (let i = 1, l = value.length - 1; i < l; i++) {
        const char = value[i];
        if (inQuotes) {
            if (current === null) {
                throw new Error("Impossible?");
            }
            if (char === '"') {
                // '""' is an escape for '"'
                if (value[i + 1] === '"') {
                    current += value[++i];
                }
                else {
                    inQuotes = false;
                    // Expect comma or end
                }
            }
            else if (char === "\\") {
                // Backslash is literal escape
                current += value[++i];
            }
            else {
                current += char;
            }
        }
        else if (char === '"') {
            if (current !== null) {
                throw new Error(`Invalid record string attempts to open quotes when value already exists '${value}'`);
            }
            inQuotes = true;
            current = "";
        }
        else if (char === ",") {
            tuple.push(current);
            current = null;
        }
        else if (current !== null) {
            current += char;
        }
        else {
            current = char;
        }
    }
    if (inQuotes) {
        throw new Error(`Invalid record string; exits whilst still in quote marks '${value}'`);
    }
    tuple.push(current);
    return tuple;
}
function realAttributeDefs(attributes) {
    const attributeDefs = Object.entries(attributes);
    return attributeDefs.filter(([_attributeName, spec]) => !spec.expression && !spec.via);
}
/**
 * Takes a list of attributes and returns a mapping function that takes a
 * composite value and turns it into a string that PostgreSQL could process as
 * the composite value.
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function makeRecordToSQLRawValue(attributes) {
    const attributeDefs = realAttributeDefs(attributes);
    return (value) => {
        const values = attributeDefs.map(([attributeName, spec]) => {
            const v = value[attributeName];
            const val = v == null ? null : spec.codec.toPg(v);
            return toRecordString(val);
        });
        return `(${values.join(",")})`;
    };
}
/**
 * Takes a list of attributes and returns a mapping function that takes a
 * PostgreSQL record string value (e.g. `(1,2,"hi")`) and turns it into a
 * JavaScript object. If `asJSON` is true, then instead of a record string value,
 * we expect a JSON array value (typically due to casting).
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function makeSQLValueToRecord(attributes, asJSON = false) {
    const attributeDefs = realAttributeDefs(attributes);
    const attributeCount = attributeDefs.length;
    return (value) => {
        const tuple = asJSON ? JSON.parse(value) : recordStringToTuple(value);
        const record = Object.create(null);
        for (let i = 0; i < attributeCount; i++) {
            const [attributeName, spec] = attributeDefs[i];
            const entry = tuple[i];
            record[attributeName] = entry == null ? null : spec.codec.fromPg(entry);
        }
        return record;
    };
}
const codecInspect = function () {
    const type = this.domainOfCodec
        ? `DomainCodec<${this.domainOfCodec.name}>`
        : this.arrayOfCodec
            ? `ListCodec<${this.arrayOfCodec.name}[]>`
            : this.rangeOfCodec
                ? `RangeCodec<${this.rangeOfCodec.name}>`
                : this.attributes
                    ? `RecordCodec`
                    : "Codec";
    return `${type}(${this.name})`;
};
/**
 * Returns a PgCodec that represents a composite type (a type with
 * attributes).
 *
 * name - the name of this type
 * identifier - a pg-sql2 fragment that uniquely identifies this type, suitable to be fed after `::` into an SQL query.
 * attributes - the attributes this composite type has
 * extensions - an optional object that you can use to associate arbitrary data with this type
 * isAnonymous - if true, this represents an "anonymous" type, typically the return value of a function or something like that. If this is true, then name and identifier are ignored.
 */
function recordCodec(config) {
    const { name, identifier, attributes, polymorphism, description, extensions, isAnonymous = false, executor, } = config;
    return {
        name,
        sqlType: identifier,
        isAnonymous,
        ...makeRecordCodecToFrom(name, attributes),
        attributes,
        polymorphism,
        description,
        extensions,
        executor,
        [inspect_js_1.inspect.custom]: codecInspect,
    };
}
(0, grafast_1.exportAs)("@dataplan/pg", recordCodec, "recordCodec");
function listCastViaUnnest(name, frag, castFromPg, guaranteedNotNull) {
    const identifier = pg_sql2_1.default.identifier(Symbol(name));
    const arraySql = (0, pg_sql2_1.default) `array(${pg_sql2_1.default.indent((0, pg_sql2_1.default) `select ${castFromPg(identifier)}\nfrom unnest(${frag}) ${identifier}`)})::text`;
    if (guaranteedNotNull) {
        return arraySql;
    }
    else {
        return (0, pg_sql2_1.default) `(case when (${frag}) is not distinct from null then null::text else ${arraySql} end)`;
    }
}
function makeRecordCodecToFrom(name, attributes) {
    const attributeDefs = realAttributeDefs(attributes);
    if (attributeDefs.some(([_attrName, attr]) => attr.codec.castFromPg)) {
        const castFromPg = (fragment) => {
            return (0, pg_sql2_1.default) `case when (${fragment}) is not distinct from null then null::text else json_build_array(${pg_sql2_1.default.join(attributeDefs.map(([attrName, attr]) => {
                const expr = (0, pg_sql2_1.default) `((${fragment}).${pg_sql2_1.default.identifier(attrName)})`;
                if (attr.codec.castFromPg) {
                    return attr.codec.castFromPg(expr, attr.codec.notNull);
                }
                else {
                    return (0, pg_sql2_1.default) `(${expr})::text`;
                }
            }), ", ")})::text end`;
        };
        return {
            castFromPg,
            listCastFromPg(frag, guaranteedNotNull) {
                return listCastViaUnnest(name, frag, castFromPg, guaranteedNotNull);
            },
            fromPg: makeSQLValueToRecord(attributes, true),
            toPg: makeRecordToSQLRawValue(attributes),
        };
    }
    else {
        return {
            fromPg: makeSQLValueToRecord(attributes),
            toPg: makeRecordToSQLRawValue(attributes),
        };
    }
}
/**
 * Returns a PgCodec that represents a Postgres enum type.
 *
 * - name - the name of the enum
 * - identifier - a pg-sql2 fragment that uniquely identifies this type, suitable to be fed after `::` into an SQL query.
 * - values - a list of the values that this enum can represent
 * - extensions - an optional object that you can use to associate arbitrary data with this type
 */
function enumCodec(config) {
    const { name, identifier, values, description, extensions } = config;
    return {
        name,
        sqlType: identifier,
        fromPg: identity,
        toPg: identity,
        values: values.map((value) => typeof value === "string" ? { value } : value),
        attributes: undefined,
        description,
        extensions,
        executor: null,
    };
}
(0, grafast_1.exportAs)("@dataplan/pg", enumCodec, "enumCodec");
function isEnumCodec(t) {
    return "values" in t;
}
const $$listCodec = Symbol("listCodec");
/**
 * Given a PgCodec, this returns a new PgCodec that represents a list
 * of the former.
 *
 * List codecs CANNOT BE NESTED - Postgres array types don't have defined
 * dimensionality, so an array of an array of a type doesn't really make sense
 * to Postgres, it being the same as an array of the type.
 *
 * @param innerCodec - the codec that represents the "inner type" of the array
 * @param extensions - an optional object that you can use to associate arbitrary data with this type
 * @param typeDelim - the delimeter used to separate entries in this list when Postgres stringifies it
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 */
function listOfCodec(listedCodec, config) {
    const innerCodec = listedCodec;
    if (!config && innerCodec[$$listCodec]) {
        return innerCodec[$$listCodec];
    }
    const { description, extensions, identifier = (0, pg_sql2_1.default) `${listedCodec.sqlType}[]`, typeDelim = `,`, name = `${innerCodec.name}[]`, } = config ?? {};
    const { fromPg: innerCodecFromPg, toPg: innerCodecToPg, listCastFromPg: innerCodecListCastFromPg, notNull: innerCodecNotNull, executor, } = innerCodec;
    const listCodec = {
        name,
        sqlType: identifier,
        fromPg: innerCodecFromPg === identity
            ? parseArray_js_1.parseArray
            : (0, parseArray_js_1.makeParseArrayWithTransform)(innerCodecFromPg),
        toPg: (value) => {
            let result = "{";
            for (let i = 0, l = value.length; i < l; i++) {
                if (i > 0) {
                    result += typeDelim;
                }
                const v = value[i];
                if (v == null) {
                    result += "NULL";
                    continue;
                }
                const str = innerCodecToPg(v);
                if (str == null) {
                    result += "NULL";
                    continue;
                }
                if (typeof str !== "string" && typeof str !== "number") {
                    throw new Error(`Do not know how to encode ${(0, inspect_js_1.inspect)(str)} to an array (send a PR!)`);
                }
                // > To put a double quote or backslash in a quoted array element
                // > value, precede it with a backslash.
                // -- https://www.postgresql.org/docs/current/arrays.html#ARRAYS-IO
                result += `"${String(str).replace(/[\\"]/g, "\\$&")}"`;
            }
            result += "}";
            return result;
        },
        attributes: undefined,
        description,
        extensions,
        arrayOfCodec: innerCodec,
        ...(innerCodecListCastFromPg
            ? {
                castFromPg: innerCodecListCastFromPg,
                listCastFromPg(frag, guaranteedNotNull) {
                    return listCastViaUnnest(`${name}_item`, frag, (identifier) => innerCodecListCastFromPg.call(this, identifier, innerCodecNotNull), guaranteedNotNull);
                },
            }
            : null),
        executor: executor,
        [inspect_js_1.inspect.custom]: codecInspect,
    };
    if (!config) {
        // Memoize such that every `listOfCodec(foo)` returns the same object.
        Object.defineProperty(innerCodec, $$listCodec, { value: listCodec });
    }
    return listCodec;
}
(0, grafast_1.exportAs)("@dataplan/pg", listOfCodec, "listOfCodec");
/**
 * Represents a PostgreSQL `DOMAIN` over the given codec
 *
 * @param innerCodec - the codec that represents the "inner type" of the domain
 * @param name - the name of the domain
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 * @param config - extra details about this domain
 */
function domainOfCodec(innerCodec, name, identifier, config = {}) {
    const { description, extensions, notNull } = config;
    return {
        // Generally same as underlying type:
        ...innerCodec,
        // Overriding:
        name,
        sqlType: identifier,
        description,
        extensions,
        domainOfCodec: innerCodec.arrayOfCodec ? undefined : innerCodec,
        notNull: Boolean(notNull),
        [inspect_js_1.inspect.custom]: codecInspect,
    };
}
(0, grafast_1.exportAs)("@dataplan/pg", domainOfCodec, "domainOfCodec");
/**
 * @see {@link https://www.postgresql.org/docs/14/rangetypes.html#RANGETYPES-IO}
 *
 * @internal
 */
function escapeRangeValue(value, innerCodec) {
    if (value == null) {
        return "";
    }
    const encoded = "" + (innerCodec.toPg(value) ?? "");
    // PERF: we don't always need to do this
    return `"${encoded.replace(/"/g, '""')}"`;
}
/**
 * Returns a PgCodec that represents a range of the given inner PgCodec
 * type.
 *
 * @param innerCodec - the PgCodec that represents the bounds of this range
 * @param name - the name of the range
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 * @param config - extra details about this range
 */
function rangeOfCodec(innerCodec, name, identifier, config = {}) {
    const { description, extensions } = config;
    const needsCast = innerCodec.castFromPg;
    const castFromPg = needsCast
        ? function castFromPg(frag) {
            return (0, pg_sql2_1.default) `json_build_array(${pg_sql2_1.default.indent((0, pg_sql2_1.default) `lower_inc(${frag}),\n${innerCodec.castFromPg((0, pg_sql2_1.default) `lower(${frag})`, innerCodec.notNull)},\n${innerCodec.castFromPg((0, pg_sql2_1.default) `upper(${frag})`, innerCodec.notNull)},\nupper_inc(${frag})`)})::text`;
        }
        : null;
    return {
        name,
        sqlType: identifier,
        description,
        extensions,
        rangeOfCodec: innerCodec,
        ...(castFromPg
            ? {
                castFromPg,
                listCastFromPg(frag, guaranteedNotNull) {
                    return listCastViaUnnest(name, frag, castFromPg, guaranteedNotNull);
                },
            }
            : null),
        fromPg: needsCast
            ? function (value) {
                const json = JSON.parse(value);
                return {
                    start: json[1] != null
                        ? {
                            value: innerCodec.fromPg(json[1]),
                            inclusive: !!json[0],
                        }
                        : null,
                    end: json[2] != null
                        ? {
                            value: innerCodec.fromPg(json[2]),
                            inclusive: !!json[3],
                        }
                        : null,
                };
            }
            : function (value) {
                const parsed = (0, postgres_range_1.parse)(value);
                return {
                    start: parsed.lower != null
                        ? {
                            value: innerCodec.fromPg(parsed.lower),
                            inclusive: parsed.isLowerBoundClosed(),
                        }
                        : null,
                    end: parsed.upper != null
                        ? {
                            value: innerCodec.fromPg(parsed.upper),
                            inclusive: parsed.isUpperBoundClosed(),
                        }
                        : null,
                };
            },
        toPg(value) {
            let str = "";
            if (value.start == null) {
                str += "(";
            }
            else {
                str += `${value.start.inclusive ? "[" : "("}${escapeRangeValue(value.start.value, innerCodec)}`;
            }
            str += ",";
            if (value.end == null) {
                str += ")";
            }
            else {
                str += `${escapeRangeValue(value.end.value, innerCodec)}${value.end.inclusive ? "]" : ")"}`;
            }
            return str;
        },
        attributes: undefined,
        executor: innerCodec.executor,
        [inspect_js_1.inspect.custom]: codecInspect,
    };
}
(0, grafast_1.exportAs)("@dataplan/pg", rangeOfCodec, "rangeOfCodec");
/**
 * When we can use the raw representation directly, typically suitable for
 * text, varchar, char, etc
 */
const verbatim = {
    castFromPg: (frag) => frag,
};
/**
 * Casts to something else before casting to text; e.g. `${expression}::numeric::text`
 */
const castVia = (via) => ({
    castFromPg(frag) {
        return (0, pg_sql2_1.default) `${pg_sql2_1.default.parens(frag)}::${via}::text`;
    },
    listCastFromPg(frag) {
        return (0, pg_sql2_1.default) `${pg_sql2_1.default.parens(frag)}::${via}[]::text[]::text`;
    },
});
const viaNumeric = castVia((0, pg_sql2_1.default) `numeric`);
// const viaJson = castVia(sql`json`);
/**
 * Casts using to_char to format dates; also handles arrays via unnest.
 */
const viaDateFormat = (format, prefix = pg_sql2_1.default.blank) => {
    const sqlFormat = pg_sql2_1.default.literal(format);
    function castFromPg(frag) {
        return (0, pg_sql2_1.default) `to_char(${prefix}${frag}, ${sqlFormat}::text)`;
    }
    return {
        castFromPg,
        listCastFromPg(frag, guaranteedNotNull) {
            return listCastViaUnnest("entry", frag, castFromPg, guaranteedNotNull);
        },
    };
};
const parseAsTrustedInt = (n) => +n;
const jsonParse = (s) => JSON.parse(s);
const jsonStringify = (o) => JSON.stringify(o);
const stripSubnet32 = {
    fromPg(value) {
        return value.replace(/\/(32|128)$/, "");
    },
};
/**
 * Built in PostgreSQL types that we support; note the keys are the "ergonomic"
 * names (like 'bigint'), but the values use the underlying PostgreSQL true
 * names (those that would be found in the `pg_type` table).
 */
exports.TYPES = {
    void: t()("2278", "void"), // void: 2278
    boolean: t()("16", "bool", {
        fromPg: (value) => value[0] === "t",
        toPg: (v) => {
            if (v === true) {
                return "t";
            }
            else if (v === false) {
                return "f";
            }
            else {
                throw new Error(`${v} isn't a boolean; cowardly refusing to cast it to postgres`);
            }
        },
    }),
    int2: t()("21", "int2", { fromPg: parseAsTrustedInt }),
    int: t()("23", "int4", { fromPg: parseAsTrustedInt }),
    bigint: t()("20", "int8"),
    float4: t()("700", "float4", { fromPg: parseFloat }),
    float: t()("701", "float8", { fromPg: parseFloat }),
    money: t()("790", "money", viaNumeric),
    numeric: t()("1700", "numeric"),
    char: t()("18", "char", verbatim),
    bpchar: t()("1042", "bpchar", verbatim),
    varchar: t()("1043", "varchar", verbatim),
    text: t()("25", "text", verbatim),
    name: t()("19", "name", verbatim),
    json: t()("114", "json", {
        fromPg: jsonParse,
        toPg: jsonStringify,
    }),
    jsonb: t()("3802", "jsonb", {
        fromPg: jsonParse,
        toPg: jsonStringify,
    }),
    xml: t()("142", "xml"),
    citext: t()(undefined, "citext", verbatim),
    uuid: t()("2950", "uuid", verbatim),
    timestamp: t()("1114", "timestamp", viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.US')),
    timestamptz: t()("1184", "timestamptz", viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM')),
    date: t()("1082", "date", viaDateFormat("YYYY-MM-DD")),
    time: t()("1083", "time", viaDateFormat("HH24:MI:SS.US", (0, pg_sql2_1.default) `date '1970-01-01' + `)),
    timetz: t()("1266", "timetz", viaDateFormat("HH24:MI:SS.USTZH:TZM", (0, pg_sql2_1.default) `date '1970-01-01' + `)),
    inet: t()("869", "inet", stripSubnet32),
    regproc: t()("24", "regproc"),
    regprocedure: t()("2202", "regprocedure"),
    regoper: t()("2203", "regoper"),
    regoperator: t()("2204", "regoperator"),
    regclass: t()("2205", "regclass"),
    regtype: t()("2206", "regtype"),
    regrole: t()("4096", "regrole"),
    regnamespace: t()("4089", "regnamespace"),
    regconfig: t()("3734", "regconfig"),
    regdictionary: t()("3769", "regdictionary"),
    cidr: t()("650", "cidr"),
    macaddr: t()("829", "macaddr"),
    macaddr8: t()("774", "macaddr8"),
    interval: t()("1186", "interval", {
        ...viaDateFormat(`YYYY_MM_DD_HH24_MI_SS.US`),
        fromPg(value) {
            const parts = value.split("_").map(parseFloat);
            // Note these are actually all integers except for `seconds`.
            const [years, months, days, hours, minutes, seconds] = parts;
            return { years, months, days, hours, minutes, seconds };
        },
        toPg: index_js_1.stringifyInterval,
    }),
    bit: t()("1560", "bit"),
    varbit: t()("1562", "varbit"),
    point: t()("600", "point", {
        fromPg: index_js_1.parsePoint,
        toPg: index_js_1.stringifyPoint,
    }),
    line: t()("628", "line", { fromPg: index_js_1.parseLine, toPg: index_js_1.stringifyLine }),
    lseg: t()("601", "lseg", { fromPg: index_js_1.parseLseg, toPg: index_js_1.stringifyLseg }),
    box: t()("603", "box", { fromPg: index_js_1.parseBox, toPg: index_js_1.stringifyBox }),
    path: t()("602", "path", { fromPg: index_js_1.parsePath, toPg: index_js_1.stringifyPath }),
    polygon: t()("604", "polygon", {
        fromPg: index_js_1.parsePolygon,
        toPg: index_js_1.stringifyPolygon,
    }),
    circle: t()("718", "circle", {
        fromPg: index_js_1.parseCircle,
        toPg: index_js_1.stringifyCircle,
    }),
    hstore: t()(undefined, "hstore", {
        fromPg: index_js_1.parseHstore,
        toPg: index_js_1.stringifyHstore,
    }),
    bytea: t()("17", "bytea", {
        fromPg(str) {
            // The bytea type supports two formats for input and output: “hex”
            // format and PostgreSQL's historical “escape” format. Both of these
            // are always accepted on input. The output format depends on the
            // configuration parameter bytea_output; the default is hex.
            // -- https://www.postgresql.org/docs/current/datatype-binary.html
            if (str.startsWith("\\x")) {
                // Hex format
                return Buffer.from(str.substring(2), "hex");
            }
            else {
                // ENHANCE: consider supporting this
                throw new Error(`PostgreSQL bytea escape format is currently unsupported, please use \`bytea_output = 'hex'\` in your PostgreSQL configuration.`);
            }
        },
        toPg(data) {
            return `\\x${data.toString("hex")}`;
        },
        isBinary: true,
    }),
};
(0, grafast_1.exportAs)("@dataplan/pg", exports.TYPES, "TYPES");
for (const [name, codec] of Object.entries(exports.TYPES)) {
    (0, grafast_1.exportAs)("@dataplan/pg", codec, ["TYPES", name]);
}
/**
 * For supported builtin type names ('void', 'bool', etc) that will be found in
 * the `pg_catalog` table this will return a PgCodec.
 */
function getCodecByPgCatalogTypeName(pgCatalogTypeName) {
    switch (pgCatalogTypeName) {
        case "void":
            return exports.TYPES.void;
        case "bool":
            return exports.TYPES.boolean;
        case "bytea":
            return exports.TYPES.bytea; // oid: 17
        case "char":
            return exports.TYPES.char;
        case "bpchar":
            return exports.TYPES.bpchar;
        case "varchar":
            return exports.TYPES.varchar;
        case "text":
            return exports.TYPES.text;
        case "name":
            return exports.TYPES.name;
        case "uuid":
            return exports.TYPES.uuid;
        case "xml":
            return exports.TYPES.xml;
        case "json":
            return exports.TYPES.json;
        case "jsonb":
            return exports.TYPES.jsonb;
        case "bit":
            return exports.TYPES.bit;
        case "varbit":
            return exports.TYPES.varbit;
        case "int2":
            return exports.TYPES.int2;
        case "int4":
            return exports.TYPES.int;
        case "int8":
            return exports.TYPES.bigint;
        case "float8":
            return exports.TYPES.float;
        case "float4":
            return exports.TYPES.float4;
        case "numeric":
            return exports.TYPES.numeric;
        case "money":
            return exports.TYPES.money;
        case "box":
            return exports.TYPES.box;
        case "point":
            return exports.TYPES.point;
        case "path":
            return exports.TYPES.path;
        case "line":
            return exports.TYPES.line;
        case "lseg":
            return exports.TYPES.lseg;
        case "circle":
            return exports.TYPES.circle;
        case "polygon":
            return exports.TYPES.polygon;
        case "cidr":
            return exports.TYPES.cidr;
        case "inet":
            return exports.TYPES.inet;
        case "macaddr":
            return exports.TYPES.macaddr;
        case "macaddr8":
            return exports.TYPES.macaddr8;
        case "date":
            return exports.TYPES.date;
        case "timestamp":
            return exports.TYPES.timestamp;
        case "timestamptz":
            return exports.TYPES.timestamptz;
        case "time":
            return exports.TYPES.time;
        case "timetz":
            return exports.TYPES.timetz;
        case "interval":
            return exports.TYPES.interval;
        case "regclass":
            return exports.TYPES.regclass;
        case "regconfig":
            return exports.TYPES.regconfig;
        case "regdictionary":
            return exports.TYPES.regdictionary;
        case "regnamespace":
            return exports.TYPES.regnamespace;
        case "regoper":
            return exports.TYPES.regoper;
        case "regoperator":
            return exports.TYPES.regoperator;
        case "regproc":
            return exports.TYPES.regproc;
        case "regprocedure":
            return exports.TYPES.regprocedure;
        case "regrole":
            return exports.TYPES.regrole;
        case "regtype":
            return exports.TYPES.regtype;
    }
    return null;
}
function getInnerCodec(codec) {
    if (codec.domainOfCodec) {
        return getInnerCodec(codec.domainOfCodec);
    }
    if (codec.arrayOfCodec) {
        return getInnerCodec(codec.arrayOfCodec);
    }
    if (codec.rangeOfCodec) {
        return getInnerCodec(codec.rangeOfCodec);
    }
    return codec;
}
(0, grafast_1.exportAs)("@dataplan/pg", getInnerCodec, "getInnerCodec");
function sqlValueWithCodec(value, codec) {
    return (0, pg_sql2_1.default) `${pg_sql2_1.default.value(value == null ? null : codec.toPg(value))}::${codec.sqlType}`;
}
//# sourceMappingURL=codecs.js.map