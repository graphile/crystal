"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgPolymorphicStep = void 0;
exports.pgPolymorphic = pgPolymorphic;
const grafast_1 = require("grafast");
const inspect_js_1 = require("../inspect.js");
/**
 * This class is used for dealing with polymorphism; you feed it a plan
 * representing an item, a second plan indicating the type of that item, and a
 * PgPolymorphicTypeMap that helps figure out which type the item is and how to
 * handle it.
 */
class PgPolymorphicStep extends grafast_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgPolymorphicStep",
    }; }
    constructor($item, $typeSpecifier, possibleTypes) {
        super();
        this.possibleTypes = possibleTypes;
        this.isSyncAndSafe = true;
        this.itemStepId = this.addDependency($item);
        this.typeSpecifierStepId = this.addDependency($typeSpecifier);
        this.types = Object.keys(possibleTypes);
        this.peerKey = JSON.stringify(this.types);
    }
    deduplicate(peers) {
        return peers.filter((peer) => {
            return peer.possibleTypes === this.possibleTypes;
        });
    }
    itemPlan() {
        return this.getDepOptions(this.itemStepId).step;
    }
    typeSpecifierPlan() {
        return this.getDepOptions(this.typeSpecifierStepId)
            .step;
    }
    planForType(type) {
        const spec = this.possibleTypes[type.name];
        if (!spec) {
            throw new Error(`${this} could resolve to ${type.name}, but can only handle the following types: '${Object.keys(this.possibleTypes).join("', '")}'`);
        }
        const $typeSpecifier = this.typeSpecifierPlan();
        const $item = this.itemPlan();
        return spec.plan($typeSpecifier, $item);
    }
    getTypeNameFromSpecifier(specifier) {
        const t = this.types.find((t) => this.possibleTypes[t].match(specifier));
        if (!t) {
            if (grafast_1.isDev) {
                console.error(`Could not find a type that matched the specifier '${(0, inspect_js_1.inspect)(specifier)}'`);
            }
            throw new grafast_1.SafeError("Could not determine the type to use for this polymorphic value.");
        }
        return t;
    }
    unbatchedExecute(_extra, _item, specifier) {
        if (specifier) {
            const typeName = this.getTypeNameFromSpecifier(specifier);
            return (0, grafast_1.polymorphicWrap)(typeName);
        }
        else {
            return null;
        }
    }
}
exports.PgPolymorphicStep = PgPolymorphicStep;
/**
 * This class is used for dealing with polymorphism; you feed it a plan
 * representing an item, a second plan indicating the type of that item, and a
 * PgPolymorphicTypeMap that helps figure out which type the item is and how to
 * handle it.
 */
function pgPolymorphic($item, $typeSpecifier, possibleTypes) {
    return new PgPolymorphicStep($item, $typeSpecifier, possibleTypes);
}
(0, grafast_1.exportAs)("@dataplan/pg", pgPolymorphic, "pgPolymorphic");
//# sourceMappingURL=pgPolymorphic.js.map