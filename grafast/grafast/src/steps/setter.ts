import type { InputObjectTypeBakedInfo } from "../index.js";
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

  set<TKey extends keyof TObj>(key: TKey, value: TObj[TKey]): void {
    this.setters.set(key, value);
  }

  apply(): void {
    for (const [key, value] of this.setters.entries()) {
      this.parent.set(key, value);
    }
  }
}

export function setter<
  TObj extends Record<string, any> = Record<string, any>,
  TParent extends SetterCapable<TObj> = SetterCapable<TObj>,
>(parent: TParent) {
  return new Setter<TObj, TParent>(parent);
}

export function createObjectAndApplyChildren<TObj extends Record<string, any>>(
  _input: Record<string, any>,
  info: InputObjectTypeBakedInfo,
): TObj {
  const obj: Partial<TObj> = Object.create(null);
  info.applyChildren(
    setter({
      set(key, value) {
        obj[key] = value;
      },
    }),
  );
  return obj as TObj;
}
