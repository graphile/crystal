"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setter = void 0;
exports.setter = setter;
exports.createObjectAndApplyChildren = createObjectAndApplyChildren;
const applyInput_js_1 = require("./applyInput.js");
class Setter extends applyInput_js_1.Modifier {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "Setter",
    }; }
    constructor(parent) {
        super(parent);
        this.setters = new Map();
    }
    set(key, value) {
        this.setters.set(key, value);
    }
    apply() {
        for (const [key, value] of this.setters.entries()) {
            this.parent.set(key, value);
        }
    }
}
exports.Setter = Setter;
function setter(parent) {
    return new Setter(parent);
}
function createObjectAndApplyChildren(_input, info) {
    const obj = Object.create(null);
    info.applyChildren(setter({
        set(key, value) {
            obj[key] = value;
        },
    }));
    return obj;
}
//# sourceMappingURL=setter.js.map