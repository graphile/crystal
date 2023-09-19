import { ExecutableStep, GrafastResultsList, GrafastValuesList } from "grafast";

export class GraphQLSelectFieldStep extends ExecutableStep {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSelectFieldStep",
  };

  isSyncAndSafe = true;

  constructor($parent: ExecutableStep) {
    super();
    this.addDependency($parent);
  }

  execute(
    count: number,
    values: [GrafastValuesList<any>],
  ): GrafastResultsList<any> {
    return values[0];
  }
}
