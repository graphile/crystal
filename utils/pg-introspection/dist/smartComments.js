"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSmartComment = void 0;
const parseSmartComment = (str) => {
    const result = {
        tags: Object.create(null),
        description: undefined,
    };
    if (str) {
        const lines = str.split(/\r?\n/);
        lines.forEach((line, i) => {
            if (i === 0 && line === "") {
                // Ignore leading newline
                return;
            }
            if (result.description !== undefined) {
                result.description += `\n${line}`;
                return;
            }
            const match = line.match(/^[ \t]*@([a-zA-Z][a-zA-Z0-9_]*)($|\s)(.*)$/);
            if (!match) {
                if (i === 1 && lines[0] === "") {
                    result.description = "\n" + line;
                }
                else {
                    result.description = line;
                }
                return;
            }
            const [, key, space, rawValue] = match;
            const value = space ? rawValue : true;
            if (key in result.tags) {
                const prev = result.tags[key];
                if (Array.isArray(prev)) {
                    prev.push(value);
                }
                else {
                    result.tags[key] = [prev, value];
                }
            }
            else {
                result.tags[key] = value;
            }
        });
    }
    if (result.description?.trim() === "") {
        result.description = undefined;
    }
    return result;
};
exports.parseSmartComment = parseSmartComment;
//# sourceMappingURL=smartComments.js.map