import type { FetcherParams, FetcherReturnType } from "@graphiql/toolkit";
import type { GrafastPlanJSON } from "grafast";
import type { RuruProps } from "../interfaces.js";
export interface IExplainedOperation {
    type: string;
    title: string;
}
export interface ExplainedSQLOperation extends IExplainedOperation {
    type: "sql";
    query: string;
    explain?: string;
}
export interface ExplainedPlanOperation extends IExplainedOperation {
    type: "plan";
    plan: GrafastPlanJSON;
}
export type ExplainedOperation = ExplainedSQLOperation | ExplainedPlanOperation;
export interface ExplainResults {
    operations: Array<ExplainedOperation>;
}
export declare const useFetcher: (props: RuruProps, options?: {
    explain?: boolean;
    verbose?: boolean;
}) => {
    fetcher: (graphQLParams: FetcherParams, opts?: import("@graphiql/toolkit").FetcherOpts | undefined) => Promise<Awaited<FetcherReturnType>>;
    explainResults: ExplainResults | null;
    streamEndpoint: string | null;
};
//# sourceMappingURL=useFetcher.d.ts.map