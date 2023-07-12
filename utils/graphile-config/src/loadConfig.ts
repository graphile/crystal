import "./interfaces.js";

import type { Extension } from "interpret";
import { jsVariants } from "interpret";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const extensions = Object.keys(jsVariants);

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch (e) {
    if (e.code === "ENOENT") {
      return false;
    } else {
      throw e;
    }
  }
}

async function registerLoader(loader: Extension | null): Promise<void> {
  if (loader === null) {
    // noop
  } else if (Array.isArray(loader)) {
    let firstError;
    for (const entry of loader) {
      try {
        await registerLoader(entry);
        return;
      } catch (e) {
        if (!firstError) {
          firstError = e;
        }
      }
    }
    throw firstError ?? new Error(`Empty array handler`);
  } else if (typeof loader === "string") {
    require(loader);
  } else if (typeof loader === "object" && loader != null) {
    const loaderModule = require(loader.module);
    loader.register(loaderModule);
  } else {
    throw new Error("Unsupported loader");
  }
}

function fixESMShenanigans(requiredModule: any): any {
  if (
    typeof requiredModule.default === "object" &&
    requiredModule.default !== null &&
    !Array.isArray(requiredModule.default)
  ) {
    return requiredModule.default;
  }
  return requiredModule;
}

export async function loadConfig(
  configPath?: string | null,
): Promise<GraphileConfig.Preset | null> {
  if (configPath != null) {
    // Explicitly load the file the user has indicated

    const resolvedPath = resolve(process.cwd(), configPath);

    // First try one of the supported loaders
    for (const extension of extensions) {
      if (resolvedPath.endsWith(extension)) {
        registerLoader(jsVariants[extension]);
        try {
          return fixESMShenanigans(require(resolvedPath));
        } catch {
          /* continue to the next one */
        }
      }
    }

    // Fallback to direct import
    return (await import(pathToFileURL(resolvedPath).href)).default;
  } else {
    // There's no config path; look for a `graphile.config.*`

    const basePath = resolve(process.cwd(), "graphile.config");
    for (const extension of extensions) {
      const resolvedPath = basePath + extension;
      if (await exists(resolvedPath)) {
        registerLoader(jsVariants[extension]);
        try {
          return fixESMShenanigans(require(resolvedPath));
        } catch (e) {
          if (e.code === "ERR_REQUIRE_ESM") {
            return (await import(pathToFileURL(resolvedPath).href)).default;
          } else {
            throw e;
          }
        }
      }
    }
  }

  // No config found
  return null;
}
