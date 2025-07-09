"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIdentifierParts = parseIdentifierParts;
function parseIdentifierParts(identifier) {
    let hadQuotes = false;
    let inQuotes = false;
    let current = "";
    const parts = [];
    for (let index = 0, l = identifier.length; index < l; index++) {
        const char = identifier[index];
        if (char === '"') {
            if (inQuotes) {
                // In SQL, two double quotes escapes a double quote in an identifier;
                // i.e. SQL `""""` becomes the JS string `"`
                if (identifier[index + 1] === '"') {
                    current += '"';
                    index++;
                }
                else {
                    inQuotes = false;
                    hadQuotes = true;
                }
            }
            else {
                if (current !== "") {
                    throw new Error(`Unexpected '${char}' at position '${index}' when parsing identifier '${identifier}'`);
                }
                inQuotes = true;
            }
        }
        else if (!inQuotes && char === ".") {
            parts.push(current);
            current = "";
            inQuotes = false;
            hadQuotes = false;
        }
        else {
            if (!inQuotes && hadQuotes) {
                throw new Error(`Unexpected '${char}' at position '${index}' when parsing identifier '${identifier}'`);
            }
            current += char;
        }
    }
    parts.push(current);
    return parts;
}
//# sourceMappingURL=parseIdentifierParts.js.map