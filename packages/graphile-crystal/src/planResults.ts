export class PlanResults {
  private store: { [pathIdentity: string]: Map<number, any> | undefined } =
    Object.create(null);

  constructor(from?: PlanResults) {
    if (from) {
      Object.assign(this.store, from.store);
    }
  }

  public set(pathIdentity: string, planId: number, data: any): any {
    if (!this.store[pathIdentity]) {
      this.store[pathIdentity] = new Map();
    }
    return this.store[pathIdentity]!.set(planId, data);
  }
  public get(pathIdentity: string, planId: number): any {
    return this.store[pathIdentity]?.get(planId);
  }
  public has(pathIdentity: string, planId: number): any {
    return this.store[pathIdentity]?.has(planId);
  }
}
