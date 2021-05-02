import debugFactory from "debug";
import { crystalPrint } from "./utils";

debugFactory.formatters.c = crystalPrint;

export { crystalEnforce } from "./enforceCrystal";
export { crystalWrapResolve, $$crystalWrapped } from "./resolvers";
