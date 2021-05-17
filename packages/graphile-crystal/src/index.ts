import debugFactory from "debug";
import { crystalPrint, crystalPrintPathIdentity } from "./utils";

debugFactory.formatters.c = crystalPrint;
debugFactory.formatters.p = crystalPrintPathIdentity;

export { crystalEnforce } from "./enforceCrystal";
export { crystalWrapResolve, $$crystalWrapped } from "./resolvers";
export * from "./plans";
