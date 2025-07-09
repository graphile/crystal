"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToPgStep = void 0;
exports.toPg = toPg;
const grafast_1 = require("grafast");
/**
 * Converts the given value to the representation suitable for feeding into the
 * PostgreSQL driver.
 *
 * @remarks This would have been a lambda, but we want to be able to deduplicate it.
 *
 * @internal
 */
class ToPgStep extends grafast_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "ToPgStep",
    }; }
    constructor($value, codec) {
        super();
        this.codec = codec;
        this.isSyncAndSafe = true;
        this.addDependency($value);
        this.peerKey = codec.name;
    }
    deduplicate(peers) {
        return peers.filter((peer) => peer.codec === this.codec);
    }
    unbatchedExecute(_extra, v) {
        return v == null ? null : this.codec.toPg(v);
    }
}
exports.ToPgStep = ToPgStep;
/**
 * Converts the given value to the representation suitable for feeding into the
 * PostgreSQL driver.
 *
 * @internal
 */
function toPg($value, codec) {
    return new ToPgStep($value, codec);
}
//# sourceMappingURL=toPg.js.map