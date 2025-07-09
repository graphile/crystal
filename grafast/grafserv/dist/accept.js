"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAcceptMatcher = makeAcceptMatcher;
const tslib_1 = require("tslib");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
/**
 * Returns a function that returns the (first, if multiple equal matches) type
 * from mediaTypes that best matches the accept query specified by the given
 * `acceptHeader`. If no Accept header is present then the first mediaType will
 * be returned. If no match is possible, `null` will be returned.
 */
function makeAcceptMatcher(mediaTypes) {
    const typeDigests = mediaTypes.map((t) => {
        // NOTE: this parsing is super lazy and isn't 100% reliable; e.g. it could
        // be broken by `foo/bar;baz="\\";frog"`. We're only handling values passed
        // by our own code though, and we ain't passing this kind of nonsense.
        const [spec, ...params] = t.split(";");
        const parameters = Object.create(null);
        for (const param of params) {
            const [key, val] = param.split("=");
            parameters[key] = val;
        }
        const [type, subtype] = spec.split("/");
        return {
            type,
            subtype,
            parameters,
            q: 1,
            originalType: t,
            noParams: Object.keys(parameters).length === 0,
        };
    });
    const lru = new lru_1.default({ maxLength: 50 });
    return function preferredAccept(acceptHeader) {
        if (acceptHeader === undefined) {
            return mediaTypes[0];
        }
        const existing = lru.get(acceptHeader);
        if (existing !== undefined) {
            return existing;
        }
        else {
            const specs = parseAccepts(acceptHeader);
            // Find the first spec that matches each, then pick the one with the
            // highest q.
            let bestQ = 0;
            let bestMediaType = null;
            for (const digest of typeDigests) {
                const highestPrecedenceSpecMatch = specs.find((spec) => {
                    return ((spec.type === "*" ||
                        (spec.type === digest.type &&
                            (spec.subtype === "*" || spec.subtype === digest.subtype))) &&
                        (spec.noParams ||
                            (!digest.noParams &&
                                matchesParameters(spec.parameters, digest.parameters))));
                });
                if (highestPrecedenceSpecMatch) {
                    if (bestMediaType === null || highestPrecedenceSpecMatch.q > bestQ) {
                        bestQ = highestPrecedenceSpecMatch.q;
                        bestMediaType = digest.originalType;
                    }
                }
            }
            lru.set(acceptHeader, bestMediaType);
            return bestMediaType;
        }
    };
}
function matchesParameters(required, given) {
    for (const key in required) {
        if (given[key] !== required[key]) {
            return false;
        }
    }
    return true;
}
const SPACE = " ".charCodeAt(0);
const HORIZONTAL_TAB = "\t".charCodeAt(0);
const ASTERISK = "*".charCodeAt(0);
const SLASH = "/".charCodeAt(0);
const COMMA = ",".charCodeAt(0);
const SEMICOLON = ";".charCodeAt(0);
const EQUALS = "=".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const BACKSLASH = "\\".charCodeAt(0);
const DEL = 0x7f;
/*
 * Whitespace:
 * 9 (tab)
 * 10 (line feed)
 * 11 (vertical tab)
 * 12 (form feed)
 * 13 (carriage return)
 * 32 (space)
 */
const WHITESPACE_START = 9;
const WHITESPACE_END = 13;
/** We're more forgiving in whitespace in most cases */
function isWhitespace(charCode) {
    return (charCode === SPACE ||
        (charCode >= WHITESPACE_START && charCode <= WHITESPACE_END));
}
/** is Optional White Space */
function isOWS(charCode) {
    return charCode === SPACE || charCode === HORIZONTAL_TAB;
}
/*
    "!" / "#" / "$" / "%" / "&" / "'" / "*"
     / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
     / DIGIT / ALPHA

33|35-39|42|43|45-57|65-90|94-122|124|126

>=33 && <= 126 && !34|40|41|44|58-64|91-93|123|125
  */
// Matches ordered from most likely to least likely for content types.
function isToken(charCode) {
    return (
    // ^_`a-z
    (charCode >= 94 && charCode <= 122) ||
        // symbols and numbers
        (charCode >= 35 &&
            charCode <= 57 &&
            charCode !== 40 &&
            charCode !== 41 &&
            charCode !== 44) ||
        // A-Z
        (charCode >= 65 && charCode <= 90) ||
        // !
        charCode === 33 ||
        // |
        charCode === 124 ||
        // ~
        charCode === 126);
}
var State;
(function (State) {
    State[State["EXPECT_TYPE"] = 0] = "EXPECT_TYPE";
    State[State["CONTINUE_TYPE"] = 1] = "CONTINUE_TYPE";
    State[State["EXPECT_SUBTYPE"] = 2] = "EXPECT_SUBTYPE";
    State[State["CONTINUE_SUBTYPE"] = 3] = "CONTINUE_SUBTYPE";
    State[State["EXPECT_COMMA_OR_SEMICOLON"] = 4] = "EXPECT_COMMA_OR_SEMICOLON";
    State[State["EXPECT_PARAMETER_NAME"] = 5] = "EXPECT_PARAMETER_NAME";
    State[State["CONTINUE_PARAMETER_NAME"] = 6] = "CONTINUE_PARAMETER_NAME";
    State[State["EXPECT_PARAMETER_VALUE"] = 7] = "EXPECT_PARAMETER_VALUE";
    State[State["CONTINUE_PARAMETER_VALUE"] = 8] = "CONTINUE_PARAMETER_VALUE";
    State[State["CONTINUE_QUOTED_PARAMETER_VALUE"] = 9] = "CONTINUE_QUOTED_PARAMETER_VALUE";
})(State || (State = {}));
// PERF: we could increase the speed of this significantly by checking the
// type/subtype against the supported types/subtypes, and if a match is not
// found then skip `i` right up to the next `,` without adding the entry to
// `accepts`
/**
 * Parser based on https://httpwg.org/specs/rfc9110.html#rfc.section.12.5.1
 *
 * @remarks
 *
 * Why must you always write your own parsers, Benjie?
 */
function parseAccepts(acceptHeader) {
    const accepts = [];
    let state = State.EXPECT_TYPE;
    let currentAccept = null;
    let currentParameterName = "";
    let currentParameterValue = "";
    function next() {
        if (currentAccept.parameters.q) {
            const q = parseFloat(currentAccept.parameters.q);
            if (Number.isNaN(q) || q < 0 || q > 1) {
                throw new Error("q out of range");
            }
            delete currentAccept.parameters.q;
            currentAccept.q = q;
        }
        accepts.push(currentAccept);
        currentAccept = null;
        state = State.EXPECT_TYPE;
    }
    for (let i = 0, l = acceptHeader.length; i < l; i++) {
        const charCode = acceptHeader.charCodeAt(i);
        switch (state) {
            case State.EXPECT_TYPE: {
                if ( /*@__INLINE__*/isWhitespace(charCode)) {
                    continue;
                }
                else if (charCode === ASTERISK) {
                    // `*/*`
                    currentAccept = {
                        type: "*",
                        subtype: "*",
                        q: 1,
                        parameters: Object.create(null),
                        noParams: true,
                    };
                    const nextCharCode = acceptHeader.charCodeAt(++i);
                    if (nextCharCode !== SLASH) {
                        throw new Error("Expected '/' after '*'");
                    }
                    const nextNextCharCode = acceptHeader.charCodeAt(++i);
                    if (nextNextCharCode !== ASTERISK) {
                        throw new Error("Expected '*' after '*/'");
                    }
                    state = State.EXPECT_COMMA_OR_SEMICOLON;
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    currentAccept = {
                        type: acceptHeader[i],
                        subtype: "",
                        q: 1,
                        parameters: Object.create(null),
                        noParams: true,
                    };
                    state = State.CONTINUE_TYPE;
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.CONTINUE_TYPE: {
                if (charCode === SLASH) {
                    state = State.EXPECT_SUBTYPE;
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    currentAccept.type += acceptHeader[i];
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.EXPECT_SUBTYPE: {
                if (charCode === ASTERISK) {
                    currentAccept.subtype = "*";
                    state = State.EXPECT_COMMA_OR_SEMICOLON;
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    currentAccept.subtype = acceptHeader[i];
                    state = State.CONTINUE_SUBTYPE;
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.CONTINUE_SUBTYPE: {
                if (charCode === SEMICOLON) {
                    // Parameters
                    state = State.EXPECT_PARAMETER_NAME;
                }
                else if (charCode === COMMA) {
                    /*@__INLINE__*/ next();
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    currentAccept.subtype += acceptHeader[i];
                }
                else if ( /*@__INLINE__*/isWhitespace(charCode)) {
                    state = State.EXPECT_COMMA_OR_SEMICOLON;
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.EXPECT_COMMA_OR_SEMICOLON: {
                if ( /*@__INLINE__*/isWhitespace(charCode)) {
                    continue;
                }
                else if (charCode === SEMICOLON) {
                    state = State.EXPECT_PARAMETER_NAME;
                }
                else if (charCode === COMMA) {
                    /*@__INLINE__*/ next();
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.EXPECT_PARAMETER_NAME: {
                if (charCode === SEMICOLON) {
                    continue;
                }
                else if (charCode === COMMA) {
                    /*@__INLINE__*/ next();
                    continue;
                }
                else if ( /*@__INLINE__*/isOWS(charCode)) {
                    continue;
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    currentParameterName = acceptHeader[i];
                    currentParameterValue = "";
                    state = State.CONTINUE_PARAMETER_NAME;
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.CONTINUE_PARAMETER_NAME: {
                if (charCode === EQUALS) {
                    state = State.EXPECT_PARAMETER_VALUE;
                    /*
                    if (currentAccept?.parameters[currentParameterName]) {
                      throw new Error("Overriding parameter!");
                    }
                    */
                    // "q" is not a valid parameter name; it's just used for weighting.
                    if (currentParameterName !== "q") {
                        currentAccept.noParams = false;
                    }
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    currentParameterName += acceptHeader[i];
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.EXPECT_PARAMETER_VALUE: {
                if (charCode === DOUBLE_QUOTE) {
                    state = State.CONTINUE_QUOTED_PARAMETER_VALUE;
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    state = State.CONTINUE_PARAMETER_VALUE;
                    currentParameterValue += acceptHeader[i];
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            case State.CONTINUE_QUOTED_PARAMETER_VALUE: {
                if (charCode === DOUBLE_QUOTE) {
                    currentAccept.parameters[currentParameterName] =
                        currentParameterValue;
                    state = State.EXPECT_COMMA_OR_SEMICOLON;
                }
                else if (charCode === BACKSLASH) {
                    if (++i === l) {
                        throw new Error(`Unexpected terminating backslash`);
                    }
                    // From the spec:
                    //
                    // > A sender SHOULD NOT generate a quoted-pair in a quoted-string
                    // > except where necessary to quote DQUOTE and backslash octets
                    // > occurring within that string. A sender SHOULD NOT generate a
                    // > quoted-pair in a comment except where necessary to quote
                    // > parentheses ["(" and ")"] and backslash octets occurring within
                    // > that comment.
                    //
                    // i.e. this isn't for `\n` and `\t` and similar, those would just
                    // come out as "n" and "t" in the output. This is specifically for
                    // escaping quote marks, parenthesis, backslashes.
                    // Respect `quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )`
                    if (charCode === HORIZONTAL_TAB ||
                        (charCode >= 0x20 && charCode <= 0xff && charCode !== DEL)) {
                        currentParameterValue += acceptHeader[i];
                    }
                    else {
                        throw new Error(`Unexpected escaped character with code '${charCode}' at position ${i}`);
                    }
                }
                else {
                    // Respect `qdtext = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text`
                    // 0x09 0x20-0xff !0x22=`"` !0x5c=`\` !0x7f=DEL
                    if (charCode === HORIZONTAL_TAB ||
                        (charCode >= 0x20 &&
                            charCode <= 0xff &&
                            /* charCode !== DOUBLE_QUOTE && */
                            /* charCode !== BACKSLASH && */
                            charCode !== DEL)) {
                        currentParameterValue += acceptHeader[i];
                    }
                    else {
                        throw new Error(`Unexpected character with code '${charCode}' at position ${i}.`);
                    }
                }
                break;
            }
            case State.CONTINUE_PARAMETER_VALUE: {
                if (charCode === SEMICOLON) {
                    currentAccept.parameters[currentParameterName] =
                        currentParameterValue;
                    // Parameters
                    state = State.EXPECT_PARAMETER_NAME;
                }
                else if (charCode === COMMA) {
                    currentAccept.parameters[currentParameterName] =
                        currentParameterValue;
                    /*@__INLINE__*/ next();
                }
                else if ( /*@__INLINE__*/isToken(charCode)) {
                    currentParameterValue += acceptHeader[i];
                }
                else {
                    throw new Error(`Unexpected character '${acceptHeader[i]}'`);
                }
                break;
            }
            default: {
                const never = state;
                throw new Error(`Unhandled state '${never}'`);
            }
        }
    }
    // Now finish parsing
    switch (state) {
        case State.EXPECT_TYPE:
        case State.CONTINUE_SUBTYPE:
        case State.EXPECT_COMMA_OR_SEMICOLON: {
            /*@__INLINE__*/ next();
            break;
        }
        case State.CONTINUE_PARAMETER_VALUE: {
            currentAccept.parameters[currentParameterName] = currentParameterValue;
            /*@__INLINE__*/ next();
            break;
        }
        case State.CONTINUE_TYPE: {
            throw new Error("Invalid 'accept' header, expected slash");
        }
        case State.EXPECT_SUBTYPE: {
            throw new Error("Invalid 'accept' header, expected subtype");
        }
        case State.EXPECT_PARAMETER_NAME: {
            throw new Error("Invalid 'accept' header, expected parameter name");
        }
        case State.CONTINUE_PARAMETER_NAME: {
            throw new Error("Invalid 'accept' header, expected parameter value");
        }
        case State.EXPECT_PARAMETER_VALUE: {
            throw new Error("Invalid 'accept' header, expected parameter value");
        }
        case State.CONTINUE_QUOTED_PARAMETER_VALUE: {
            throw new Error("Invalid 'accept' header, expected closing quote");
        }
        default: {
            const never = state;
            throw new Error(`Unhandled terminal state '${never}'`);
        }
    }
    // Sort `accepts` by precedence. Precedence is how accurate the match is:
    // a/b;c=d
    // a/b
    // a/*
    // */*
    const score = (accept) => {
        let val = 0;
        if (accept.type !== "*") {
            val += 1_000;
        }
        if (accept.subtype !== "*") {
            val += 1_000_000;
        }
        val += Object.keys(accept.parameters).length;
        return val;
    };
    accepts.sort((a, z) => {
        const scoreA = score(a);
        const scoreZ = score(z);
        return scoreZ - scoreA;
    });
    return accepts;
}
//# sourceMappingURL=accept.js.map