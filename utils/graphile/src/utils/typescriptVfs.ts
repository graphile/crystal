import {
  createFSBackedSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import * as ts from "typescript";

export function configVfs(options: {
  filename?: string;
  initialCode?: string;
}) {
  const { filename = "graphile.config.ts", initialCode = "" } = options;
  const filenameInJs = filename.replace(/\.([mc]?)(ts)$/, ".$1js");

  const compilerOpts: ts.CompilerOptions = {
    module: ts.ModuleKind.Node16,
    target: ts.ScriptTarget.ESNext,

    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.Node16,
    allowJs: true,
  };
  /*
const compilerOptions = {
  strict: true,
  target: ts.ScriptTarget.ES2015,
  typeRoots: [],
  lib: ["es5"],
  skipDefaultLibCheck: true,
  skipLibCheck: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  module: ts.ModuleKind.ES2015,
};
*/
  const fsMap = new Map<string, string>();

  const FAKE_FILENAME = "graphileConfigInspection.ts";

  // If using imports where the types don't directly match up to their FS representation (like the
  // imports for node) then use triple-slash directives to make sure globals are set up first.
  const BASE_CONTENT = `\
/// <reference types="node" />
import "graphile-config";
import {} from './${filenameInJs}';
type Digest<T> = { [TKey in keyof T]: T[TKey] } & {};
${initialCode}`;
  fsMap.set(FAKE_FILENAME, BASE_CONTENT);

  // By providing a project root, then the system knows how to resolve node_modules correctly
  const projectRoot = process.cwd();
  const system = createFSBackedSystem(fsMap, projectRoot, ts);
  const env = createVirtualTypeScriptEnvironment(
    system,
    [FAKE_FILENAME, filename],
    ts,
    compilerOpts,
  );

  function getCompletions(additionalContent = "", offsetFromEnd = 0) {
    const content = BASE_CONTENT + additionalContent;
    env.updateFile(FAKE_FILENAME, content);
    const completions = env.languageService.getCompletionsAtPosition(
      FAKE_FILENAME,
      content.length - offsetFromEnd,
      {},
    );
    return completions;
  }

  function getQuickInfo(additionalContent = "", offsetFromEnd = 0) {
    const contentWithProperty = BASE_CONTENT + additionalContent;
    env.updateFile(FAKE_FILENAME, contentWithProperty);
    const info = env.languageService.getQuickInfoAtPosition(
      FAKE_FILENAME,
      contentWithProperty.length - offsetFromEnd,
    );
    return info;
  }

  return { env, FAKE_FILENAME, BASE_CONTENT, getCompletions, getQuickInfo };
}

/**
 * @deprecated use prettyQuickInfoDisplayParts instead
 */
export function prettyDisplayParts(
  displayParts: ReadonlyArray<ts.SymbolDisplayPart> | undefined,
  trimUntil = ":",
): string {
  if (!displayParts) {
    return "";
  }
  let found = !trimUntil;
  let depth = 0;
  let str = "";
  for (const { text } of displayParts) {
    if (found) {
      str += text;
    } else if (text === "(" || text === "[") {
      depth++;
    } else if (text === ")" || text === "]") {
      depth--;
    } else if (text === trimUntil && depth === 0) {
      found = true;
    }
  }
  return str.trim();
}

export function prettyQuickInfoDisplayParts(
  quickInfo: ts.QuickInfo | undefined,
  omitThis = true,
): string {
  if (!quickInfo || !quickInfo.displayParts) {
    return "";
  }
  const fullText = quickInfo.displayParts.map((p) => p.text).join("");
  function tidy(text: string): string {
    const withoutThis = omitThis
      ? text.replace(/this: [^,)]+(, |(?=[)]))/g, "")
      : text;
    return withoutThis.trim();
  }
  if (quickInfo.kind === "method") {
    const secondBracket = fullText.indexOf("(", 1);
    if (secondBracket < 0) {
      throw new Error(
        `Do not understand TypeScript displayParts(${quickInfo.kind}) format '${fullText}'`,
      );
    }
    return tidy(fullText.substring(secondBracket));
  } else if (quickInfo.kind === "property") {
    const colon = fullText.indexOf("(", 1);
    if (colon < 0) {
      throw new Error(
        `Do not understand TypeScript displayParts(${quickInfo.kind}) format '${fullText}'`,
      );
    }
    return ": " + tidy(fullText.substring(colon));
  } else {
    console.error(
      `Do not understand TypeScript displayParts(${quickInfo.kind}). '${fullText}'`,
    );
    return tidy(fullText);
  }
}

export function prettyDocumentation(
  parts: ReadonlyArray<ts.SymbolDisplayPart> | undefined,
): string {
  if (!parts) {
    return "";
  }
  let text = "";
  for (const part of parts) {
    switch (part.kind) {
      case "text": {
        text += part.text;
        break;
      }
      default: {
        text += part.text;
        break;
      }
    }
  }
  return text.trim();
}

export function truncate(text: string, length = 80): string {
  if (text.length < length) {
    return text;
  } else {
    return text.substring(0, length - 1) + "…";
  }
}

export function tightDocumentation(
  info: ts.QuickInfo | undefined,
  length = 60,
) {
  if (!info) return "";
  return truncate(
    prettyDocumentation(info.documentation).replace(/[\r\n]+/g, " "),
    length,
  );
}

function stripArgTypes(text: string): string {
  let depth = -1;
  let result = "";
  for (let i = 0, l = text.length; i < l; i++) {
    const char = text[i];
    if (depth < 0) {
      if (char === "(") {
        depth++;
      }
      result += char;
    } else if (depth === 0) {
      if (char === ":") {
        depth = 1;
      } else if (char === ")") {
        depth--;
        result += char;
      } else {
        result += char;
      }
    } else {
      if (depth === 1 && char === ",") {
        depth--;
        result += char;
      } else if (depth === 1 && char === ")") {
        depth--;
        depth--;
        result += char;
      } else {
        if (char === "<" || char === "(" || char === "[") {
          depth++;
        } else if (char === ">" || char === ")" || char === "]") {
          depth--;
        }
      }
    }
  }
  return result;
}

export function tightDisplayParts(info: ts.QuickInfo | undefined, length = 60) {
  if (!info) return "";
  if (info.kind === "method" || info.kind === "property") {
    const text = prettyQuickInfoDisplayParts(info);
    const withoutArgTypes = stripArgTypes(text);
    return truncate(withoutArgTypes, length);
  } else {
    throw new Error(
      `Don't know how to print tightDisplayParts for ${info.kind}`,
    );
  }
}

export const accessKey = (key: string): string => {
  // TODO: improve?
  if (/^[A-Za-z0-9_]+$/.test(key)) {
    return `.${key}`;
  } else {
    return `[${JSON.stringify(key)}]`;
  }
};

/*
debugger;

const host = createVirtualCompilerHost(system, compilerOpts, ts);
const program = ts.createProgram({
  rootNames: [...fsMap.keys()],
  options: compilerOpts,
  host: host.compilerHost,
});
const checker = program.getTypeChecker();

// This will update the fsMap with new files
// for the .d.ts and .js files
program.emit();

// Now I can look at the AST for the .ts file too
const index = program.getSourceFile(FAKE_FILENAME)!;
const symbols = checker.getSymbolsInScope(index, ts.SymbolFlags.Variable);
const symbol = symbols.find((s) => s.name === "preset");
console.log(symbol);
if (symbol) {
  const type = checker.getDeclaredTypeOfSymbol(symbol);
  console.log(type.getApparentProperties());
  console.dir(type.get);
  const properties = type.getProperties();
  console.dir(properties);
}
ts.forEachChild(index, (node) => {
  if (isVariableStatement(node)) {
    console.log(node.getText());
    const node2 = node.declarationList.declarations[0];
    console.log(node2.getText());
    const type = checker.getTypeAtLocation(node2);
    const properties = type.getProperties();
    // const properties = checker.getDeclaredTypeOfSymbol(symbol).getProperties();
    console.dir(properties);
  }
});
*/
