import { SourceTextModule, SyntheticModule } from "node:vm";

export async function runModule<T = any>(
  code: string,
  filename: string,
): Promise<T> {
  const mod = new SourceTextModule(code, { identifier: filename });
  await mod.link(async (specifier) => {
    const exports = await import(specifier);
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) {
        this.setExport(key, value);
      }
    });
  });
  await mod.evaluate();
  return mod.namespace as any;
}
