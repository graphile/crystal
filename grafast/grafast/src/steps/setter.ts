import { Modifier } from "./applyInput.js";

export interface SetterCapable<TObj extends Record<string, any>> {
  set<TKey extends keyof TObj>(key: TKey, value: TObj[TKey]): void;
}

export class Setter<
  TObj extends Record<string, any> = Record<string, any>,
  TParent extends SetterCapable<TObj> = SetterCapable<TObj>,
> extends Modifier<TParent> {
  static $$export = {
    moduleName: "grafast",
    exportName: "Setter",
  };

  private setters = new Map<keyof TObj, TObj[keyof TObj]>();

  constructor(parent: TParent) {
    super(parent);
  }

  set<TKey extends keyof TObj>(key: TKey, valuePlan: TObj[TKey]): void {
    this.setters.set(key, valuePlan);
  }

  apply(): void {
    for (const [key, valuePlan] of this.setters.entries()) {
      this.parent.set(key, valuePlan);
    }
  }
}

export function setter<
  TObj extends Record<string, any> = Record<string, any>,
  TParent extends SetterCapable<TObj> = SetterCapable<TObj>,
>(parent: TParent) {
  return new Setter<TObj, TParent>(parent);
}
