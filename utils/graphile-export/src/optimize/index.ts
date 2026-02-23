import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

/** @see {@link https://github.com/babel/babel/issues/14881} */
const $$patched = Symbol("babel-14881-hack");
function patch(scope: any) {
  if (!scope[$$patched]) {
    scope[$$patched] = true;
    const original = scope._replaceWith;
    scope._replaceWith = function (...args: any[]) {
      if (!this.opts?.noScope) {
        this._removeFromScope();
      }
      return original.apply(this, args);
    };
  }
}
patch(NodePath.prototype);

Error.stackTraceLimit = 100;

function isSimpleArg(
  arg: t.Node,
): arg is t.Literal | t.Identifier | t.MemberExpression {
  return (
    t.isLiteral(arg) ||
    t.isIdentifier(arg) ||
    (t.isMemberExpression(arg) &&
      isSimpleArg(arg.object) &&
      isSimpleArg(arg.property))
  );
}

function isSimpleParam(param: t.Node): param is t.Identifier {
  return t.isIdentifier(param);
}

const getExpression = (functionBody: t.BlockStatement | t.Expression) => {
  if (t.isExpression(functionBody)) {
    return functionBody;
  } else if (functionBody.body.length === 1) {
    const statement = functionBody.body[0];
    if (statement.type === "ReturnStatement") {
      return statement.argument;
    }
  }
};

export const optimize = (inAst: t.File, runs = 1): t.File => {
  let ast = inAst;
  // Reset the full AST
  ast = parse(generate(ast).code, { sourceType: "module" });

  traverse(ast, {
    LogicalExpression: {
      enter(path) {
        if (
          (path.node.operator === "??" || path.node.operator === "||") &&
          expressionIsAlwaysTruthy(path.node.left)
        ) {
          path.replaceWith(path.node.left);
        }
      },
    },
    TemplateLiteral: {
      enter(path) {
        let changed = false;
        let quasis = path.node.quasis;
        let expressions = path.node.expressions;
        for (let i = 0, l = expressions.length; i < l; i++) {
          const expression = expressions[i];
          if (expression.type === "StringLiteral") {
            // Inline it
            if (!changed) {
              changed = true;
              quasis = [...path.node.quasis];
              expressions = [...path.node.expressions];
            }
            quasis[i] = {
              ...quasis[i],
              value: {
                raw:
                  quasis[i].value.raw +
                  expression.value +
                  quasis[i + 1].value.raw,
                cooked:
                  quasis[i].value.cooked +
                  expression.value +
                  quasis[i + 1].value.cooked,
              },
            };
            quasis.splice(i + 1, 1);
            expressions.splice(i, 1);
            i--;
            l--;
          }
        }
        if (changed) {
          path.replaceWith({
            ...path.node,
            quasis,
            expressions,
          });
        }
      },
    },
    SpreadElement: {
      enter(path) {
        if (
          path.node.argument.type === "NullLiteral" &&
          path.parentPath.isObjectExpression()
        ) {
          path.remove();
        }
      },
    },
    VariableDeclaration: {
      enter(path) {
        const node = path.node;
        if (node.declarations.length === 1) {
          const declaration = node.declarations[0];
          const name = declaration.id;
          if (name.type === "Identifier") {
            const fn = declaration.init;
            if (fn && fn.type === "FunctionExpression") {
              const functionDecl = t.functionDeclaration(
                name,
                fn.params,
                fn.body,
                fn.generator,
                fn.async,
              );
              path.replaceWith(functionDecl);
            }
          }
        }
      },
    },
    CallExpression: {
      enter(path) {
        const node = path.node;

        if (
          !t.isArrowFunctionExpression(node.callee) &&
          !t.isFunctionExpression(node.callee)
        ) {
          return;
        }

        const args = node.arguments;
        const params = node.callee.params;
        if (params.length !== args.length) {
          return;
        }

        const expression = getExpression(node.callee.body);

        if (!expression) {
          return;
        }

        if (!args.every(isSimpleArg)) {
          return;
        }

        if (!params.every(isSimpleParam)) {
          return;
        }

        // console.log("Found IIFE", generate(node, {}).code);

        const calleePath = path.get("callee");
        const rawParamsPaths = calleePath.get("params");
        const paramsPaths = Array.isArray(rawParamsPaths)
          ? rawParamsPaths
          : [rawParamsPaths];
        const argumentsPaths = path.get("arguments");
        for (let i = params.length - 1; i >= 0; i--) {
          const param = params[i];
          const arg = args[i];
          const paramPath = paramsPaths[i];
          const argPath = argumentsPaths[i];

          if (t.isIdentifier(arg)) {
            // const binding = calleePath.scope.bindings[param.name];

            // TODO: how do we correctly determine if this is safe?
            if (!calleePath.scope.hasOwnBinding(arg.name)) {
              // Rename the references to this arg to match the arg.
              calleePath.scope.rename(param.name, arg.name);

              // Remove the parameters if they match (which they should!).
              const newParam = node.callee.params[i];
              const newArg = node.arguments[i];
              if (
                t.isIdentifier(newParam) &&
                t.isIdentifier(newArg) &&
                newParam.name === newArg.name
              ) {
                // Remove the arg/param, since it's now pointless
                argPath.remove();
                paramPath.remove();
                paramPath.scope.removeBinding(param.name);
              }
            }
          } else if (t.isLiteral(arg) || t.isMemberExpression(arg)) {
            const binding = calleePath.scope.bindings[param.name];

            // Replace all references to this identifier with the value
            binding.referencePaths.forEach((referencePath) => {
              referencePath.replaceWith(t.cloneNode(arg));
            });

            // Remove the arg/param
            argPath.remove();
            paramPath.remove();
            paramPath.scope.removeBinding(param.name);
          }
        }

        if (node.arguments.length === 0 && node.callee.params.length === 0) {
          // We don't need this IIFE any more
          path.replaceWith(getExpression(node.callee.body)!);
        }

        // console.log("REPLACED :", generate(path.node, {}).code);

        return;
      },
    },
    Program: {
      exit(exitPath) {
        // Make sure our scope information is up to date!
        exitPath.scope.crawl();

        // If a local top-level function is only ever called directly, and all
        // calls pass the same identifier arguments in some positions, inline
        // those identifiers into the function body and remove the redundant
        // parameters/arguments.
        exitPath.traverse({
          VariableDeclarator: optimizeCommonLeadingCallArgs,
          FunctionDeclaration: optimizeCommonLeadingCallArgs,
        });

        // Replace all things that are only referenced once.
        // This nested traversal approach inspired by https://github.com/babel/babel/issues/15544#issuecomment-1540542863
        exitPath.traverse({
          VariableDeclarator: visitSubpath,
          FunctionDeclaration: visitSubpath,
        });
        function visitSubpath(
          path:
            | NodePath<t.VariableDeclarator>
            | NodePath<t.FunctionDeclaration>,
        ) {
          if (!t.isIdentifier(path.node.id)) {
            return;
          }
          const bindingName = path.node.id.name;
          const scope = t.isFunctionDeclaration(path.node)
            ? path.scope.parent
            : path.scope;
          // Only optimize at top level
          if (scope !== exitPath.scope) {
            return;
          }
          const binding = scope.bindings[bindingName];
          if (!binding) {
            return;
          }
          const expr = t.isFunctionDeclaration(path.node)
            ? // Convert function to expression
              t.functionExpression(
                path.node.id,
                path.node.params,
                path.node.body,
                path.node.generator,
                path.node.async,
              )
            : path.node.init;
          if (!expr) {
            return;
          }

          // Skip if it's an export
          const statementPath = path.getStatementParent();
          if (
            !statementPath ||
            t.isExportNamedDeclaration(statementPath.node) ||
            t.isExportDefaultDeclaration(statementPath.node)
          ) {
            return;
          }

          // Only replace if it's only referenced once (we don't want duplicates)
          if (binding.referencePaths.length !== 1) {
            return;
          }
          const targetPath = binding.referencePaths[0];
          const parent = targetPath.parent;

          // Don't turn this into an IIFE
          if (
            parent &&
            t.isCallExpression(parent) &&
            parent.callee === targetPath.node &&
            (!t.isArrowFunctionExpression(expr) || t.isBlock(expr.body))
          ) {
            return;
          }

          // It's allowed if:
          // 1. it's a simple value (scalar), OR
          // 2. it's not being inserted into a function body
          const targetFunctionParent = targetPath.getFunctionParent();
          const sourceFunctionParent = path.getFunctionParent();
          if (targetFunctionParent !== sourceFunctionParent) {
            return;
          }

          targetPath.replaceWith(expr);
          // This stopping is important to avoid 'Container is falsy' errors.
          targetPath.stop();
          scope.removeBinding(bindingName);
          path.remove();
        }

        function optimizeCommonLeadingCallArgs(
          path:
            | NodePath<t.VariableDeclarator>
            | NodePath<t.FunctionDeclaration>,
        ) {
          let bindingName: string | null = null;
          let functionPath:
            | NodePath<t.FunctionDeclaration>
            | NodePath<t.FunctionExpression | t.ArrowFunctionExpression>
            | null = null;

          if (path.isFunctionDeclaration()) {
            if (!path.node.id) {
              return;
            }
            bindingName = path.node.id.name;
            functionPath = path;
          } else {
            if (!t.isIdentifier(path.node.id)) {
              return;
            }
            const init = path.get("init");
            if (
              !init ||
              (!init.isFunctionExpression() && !init.isArrowFunctionExpression())
            ) {
              return;
            }
            bindingName = path.node.id.name;
            functionPath = init as NodePath<
              t.FunctionExpression | t.ArrowFunctionExpression
            >;
          }

          const scope = path.isFunctionDeclaration() ? path.scope.parent : path.scope;
          if (scope !== exitPath.scope) {
            return;
          }
          if (!bindingName) {
            return;
          }

          const statementPath = path.getStatementParent();
          if (
            !statementPath ||
            t.isExportNamedDeclaration(statementPath.node) ||
            t.isExportDefaultDeclaration(statementPath.node)
          ) {
            return;
          }

          const binding = scope.bindings[bindingName];
          if (!binding || binding.referencePaths.length === 0) {
            return;
          }

          const params = functionPath.node.params;
          if (params.length === 0) {
            return;
          }

          const callPaths: NodePath<t.CallExpression>[] = [];
          for (const refPath of binding.referencePaths) {
            const parentPath = refPath.parentPath;
            if (
              !parentPath?.isCallExpression() ||
              parentPath.node.callee !== refPath.node
            ) {
              return;
            }
            callPaths.push(parentPath);
          }
          if (callPaths.length === 0) {
            return;
          }

          const indexesToEliminate: number[] = [];
          const maxIndex = Math.min(
            params.length,
            ...callPaths.map((callPath) => callPath.node.arguments.length),
          );
          for (let i = 0; i < maxIndex; i++) {
            const param = functionPath.node.params[i];
            if (!t.isIdentifier(param)) {
              continue;
            }
            const firstArg = callPaths[0].node.arguments[i];
            if (!t.isIdentifier(firstArg)) {
              continue;
            }
            const firstArgBinding = callPaths[0].scope.getBinding(firstArg.name);
            if (!firstArgBinding || firstArgBinding.scope !== exitPath.scope) {
              continue;
            }
            let allMatch = true;
            for (let j = 1; j < callPaths.length; j++) {
              const arg = callPaths[j].node.arguments[i];
              if (!t.isIdentifier(arg) || arg.name !== firstArg.name) {
                allMatch = false;
                break;
              }
              const argBinding = callPaths[j].scope.getBinding(arg.name);
              if (!argBinding || argBinding.scope !== exitPath.scope) {
                allMatch = false;
                break;
              }
            }
            if (!allMatch) {
              continue;
            }
            if (firstArg.name === param.name) {
              indexesToEliminate.push(i);
              continue;
            }
            if (functionPath.scope.hasOwnBinding(firstArg.name)) {
              continue;
            }
            indexesToEliminate.push(i);
          }

          if (indexesToEliminate.length === 0) {
            return;
          }

          for (const i of indexesToEliminate) {
            const param = functionPath.node.params[i];
            const firstArg = callPaths[0].node.arguments[i];
            if (!t.isIdentifier(param) || !t.isIdentifier(firstArg)) {
              return;
            }
            if (param.name !== firstArg.name) {
              functionPath.scope.rename(param.name, firstArg.name);
            }
          }

          for (let k = indexesToEliminate.length - 1; k >= 0; k--) {
            const i = indexesToEliminate[k];
            functionPath.node.params.splice(i, 1);
            for (const callPath of callPaths) {
              callPath.node.arguments.splice(i, 1);
            }
          }
        }
      },
    },
    BlockStatement(path) {
      const body = path.node.body;

      // Only strip if it's a statement within another block statement or the
      // program. We don't want to trim block wrappers around for/if/while/etc
      if (!path.parentPath.isBlockStatement() && !path.parentPath.isProgram()) {
        return;
      }

      // Don't strip a block if there's any variable declarations in it.
      if (body.some(t.isVariableDeclaration)) {
        return;
      }

      path.replaceWithMultiple(body);
    },
  });

  ast = parse(generate(ast).code, { sourceType: "module" });

  // convert `plan: function plan() {...}` to `plan() { ... }`
  // convert `fn(...["a", "b"])` to `fn("a", "b")`
  // remove `if (false) { ... }` / `if (null)` / `if (undefined)`
  traverse(ast, {
    IfStatement(path) {
      const test = path.node.test;
      if (expressionIsAlwaysFalsy(test)) {
        if (path.node.alternate) {
          path.replaceWith(path.node.alternate);
        } else {
          path.remove();
        }
      } else if (expressionIsAlwaysTruthy(test)) {
        path.replaceWith(path.node.consequent);
      }
    },
    ConditionalExpression(path) {
      const test = path.node.test;
      if (expressionIsAlwaysFalsy(test)) {
        path.replaceWith(path.node.alternate);
      } else if (expressionIsAlwaysTruthy(test)) {
        path.replaceWith(path.node.consequent);
      }
    },
    ObjectProperty(path) {
      if (!t.isIdentifier(path.node.key)) {
        return;
      }
      const func = path.node.value;
      if (!t.isFunctionExpression(func) && !t.isArrowFunctionExpression(func)) {
        return;
      }
      if (t.isArrowFunctionExpression(func)) {
        // Check if it contains `this`; if so, do not rewrite
        const hasThis = !!path
          .get("value")
          .find((path) => t.isThisExpression(path.node));
        if (hasThis) {
          return;
        }
      }
      /*
      if (!func.id) {
        return;
      }
      if (func.id.name !== path.node.key.name) {
        return;
      }
      */
      const body = t.isBlock(func.body)
        ? func.body
        : t.blockStatement([t.returnStatement(func.body)]);
      path.replaceWith(
        t.objectMethod(
          "method",
          path.node.key,
          func.params,
          body,
          false,
          func.generator,
          func.async,
        ),
      );
    },
    CallExpression(path) {
      const argsPath = path.get("arguments");
      if (argsPath.length === 1) {
        const argPath = argsPath[0];
        if (t.isSpreadElement(argPath.node)) {
          const spreadPath = argPath as NodePath<t.SpreadElement>;
          if (t.isArrayExpression(spreadPath.node.argument)) {
            argPath.replaceWithMultiple(
              spreadPath.node.argument.elements.filter(isNotNullish),
            );
          }
        }
      }
    },
  });

  if (runs < 2) {
    return optimize(ast, runs + 1);
  }

  return ast;
};

function isNotNullish<T>(o: T | null | undefined): o is T {
  return o != null;
}

function expressionIsAlwaysFalsy(test: t.Expression) {
  switch (test.type) {
    case "Identifier":
      return test.name === "undefined";
    case "NullLiteral":
      return true;
    case "BooleanLiteral":
      return !test.value;
    case "StringLiteral":
      return !test.value;
    case "BinaryExpression": {
      switch (test.operator) {
        case "!=": {
          if (
            expressionIsNullOrUndefined(test.left) &&
            expressionIsNullOrUndefined(test.right)
          ) {
            return true;
          }
          return false;
        }
        default: {
          return false;
        }
      }
    }
    default:
      return false;
  }
}

function expressionIsAlwaysTruthy(test: t.Expression) {
  switch (test.type) {
    case "BooleanLiteral":
      return test.value;
    case "StringLiteral":
      return !!test.value;
    case "NumericLiteral":
      return !!test.value;
    default:
      return false;
  }
}
function expressionIsNullOrUndefined(expr: t.Expression | t.PrivateName) {
  return (
    expr.type === "NullLiteral" ||
    (expr.type === "Identifier" && expr.name === "undefined")
  );
}
