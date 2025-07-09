import { Modifier } from "grafast";
import type { PgResource } from "../datasource.js";
import { PgTempTable } from "../steps/pgTempTable.js";
import { PgClassFilter } from "./pgClassFilter.js";
export declare class PgManyFilter<TChildResource extends PgResource<any, any, any, any, any>> extends Modifier<PgClassFilter> {
    childDataSource: TChildResource;
    private myAttrs;
    private theirAttrs;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    someTemp: PgTempTable<TChildResource> | null;
    constructor($parentFilterPlan: PgClassFilter, childDataSource: TChildResource, myAttrs: string[], theirAttrs: string[]);
    some(): PgClassFilter<PgTempTable<TChildResource>>;
    apply(): void;
}
//# sourceMappingURL=pgManyFilter.d.ts.map