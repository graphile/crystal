import assert from "node:assert";
import { inspect } from "node:util";

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

type ScalarConstant =
  | t.BooleanLiteral
  | t.NullLiteral
  | t.StringLiteral
  | t.NumericLiteral
  | t.BigIntLiteral
  | (t.Identifier & { name: "undefined" });

function isScalarConstant(arg: t.Node): arg is ScalarConstant {
  return (
    t.isBooleanLiteral(arg) ||
    t.isNullLiteral(arg) ||
    t.isStringLiteral(arg) ||
    t.isNumericLiteral(arg) ||
    t.isBigIntLiteral(arg) ||
    (t.isIdentifier(arg) && arg.name === "undefined")
  );
}

function getScalarConstantValue(arg: ScalarConstant) {
  switch (arg.type) {
    case "NullLiteral": {
      return null;
    }
    case "Identifier": {
      assert.equal(arg.name, "undefined");
      return undefined;
    }
    case "BigIntLiteral": {
      return BigInt(arg.value);
    }
    default: {
      return arg.value;
    }
  }
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

function isSafeTemplateLiteralStringChunk(value: string): boolean {
  return !value.includes("`") && !value.includes("\\") && !value.includes("${");
}

type ParamAction = { argIdx: number; name: string } & (
  | { _: "eliminate" }
  | { _: "substitute"; value: t.Expression }
  | { _: "rename"; to: string }
);

function resolveBinaryOperator(
  operator: t.BinaryExpression["operator"],
  leftVal: any,
  rightVal: any,
) {
  switch (operator) {
    case "===":
      return t.booleanLiteral(leftVal === rightVal);
    case "!==":
      return t.booleanLiteral(leftVal !== rightVal);
    case "==":
      return t.booleanLiteral(leftVal == rightVal);
    case "!=":
      return t.booleanLiteral(leftVal != rightVal);
    case ">":
      return t.booleanLiteral(leftVal > rightVal);
    case "<":
      return t.booleanLiteral(leftVal < rightVal);
    case ">=":
      return t.booleanLiteral(leftVal >= rightVal);
    case "<=":
      return t.booleanLiteral(leftVal <= rightVal);
    default: {
      return undefined;
    }
  }
}

/** Returns true if the result will always be interpreted as a boolean */
function isBooleanContext(path: NodePath<t.LogicalExpression>): boolean {
  const parentNode = path.parentPath.node;
  if (
    (t.isConditionalExpression(parentNode) || t.isIfStatement(parentNode)) &&
    parentNode.test === path.node
  ) {
    return true;
  }
  if (t.isUnaryExpression(parentNode) && parentNode.operator === "!") {
    return true;
  }
  return false;
}

export const optimize = (inAst: t.File): t.File => {
  // Reset the full AST, since it will have been mangled and we want the latest
  // bindings to be synchronized.
  const ast = parse(generate(inAst).code, { sourceType: "module" });

  // convert `plan: function plan() {...}` to `plan() { ... }`
  // convert `fn(...["a", "b"])` to `fn("a", "b")`
  // remove `if (false) { ... }` / `if (null)` / `if (undefined)`
  traverse(ast, {
    LogicalExpression: {
      exit(path) {
        const { operator, left, right } = path.node;
        switch (operator) {
          case "??": {
            if (expressionIsAlwaysTruthy(left)) {
              path.replaceWith(left);
            } else if (expressionIsNullOrUndefined(left)) {
              path.replaceWith(right);
            } else if (
              expressionIsNullOrUndefined(right) &&
              isBooleanContext(path)
            ) {
              path.replaceWith(left);
            }
            break;
          }
          case "||": {
            if (expressionIsAlwaysTruthy(left)) {
              path.replaceWith(left);
            } else if (expressionIsAlwaysFalsy(left)) {
              path.replaceWith(right);
            } else if (
              expressionIsAlwaysFalsy(right) &&
              isBooleanContext(path)
            ) {
              path.replaceWith(left);
            }
            break;
          }
          case "&&": {
            if (expressionIsAlwaysFalsy(left)) {
              path.replaceWith(left);
            } else if (expressionIsAlwaysTruthy(left)) {
              path.replaceWith(right);
            } else if (
              expressionIsAlwaysTruthy(right) &&
              isBooleanContext(path)
            ) {
              path.replaceWith(left);
            }
            break;
          }
        }
      },
    },
    BinaryExpression: {
      exit(path) {
        const { left, right, operator } = path.node;
        if (isScalarConstant(left) && isScalarConstant(right)) {
          const leftVal = getScalarConstantValue(left);
          const rightVal = getScalarConstantValue(right);
          const replacement = resolveBinaryOperator(
            operator,
            leftVal,
            rightVal,
          );
          if (replacement) {
            path.replaceWith(replacement);
          }
        }
      },
    },
    TemplateLiteral: {
      exit(path) {
        let changed = false;
        let quasis = path.node.quasis;
        let expressions = path.node.expressions;
        for (let i = 0, l = expressions.length; i < l; i++) {
          const expression = expressions[i];
          if (expression.type === "StringLiteral") {
            if (
              !isSafeTemplateLiteralStringChunk(expression.value) ||
              quasis[i].value.cooked == null ||
              quasis[i + 1].value.cooked == null
            ) {
              continue;
            }
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
      exit(path) {
        // `...null` becomes nothing
        if (
          path.node.argument.type === "NullLiteral" &&
          path.parentPath.isObjectExpression()
        ) {
          path.remove();
        }

        // `fn(a, b, ...[c, d, e])` becomes `fn(a, b, c, d, e)`
        // `[a, b, ...[c, d, e]]` becomes `[a, b, c, d, e]`
        if (t.isArrayExpression(path.node.argument)) {
          const parentNode = path.parentPath.node;
          if (
            t.isCallExpression(parentNode) ||
            t.isArrayExpression(parentNode)
          ) {
            path.replaceWithMultiple(
              path.node.argument.elements.filter(isNotNullish),
            );
          }
        }
      },
    },
    VariableDeclaration: {
      exit(path) {
        const node = path.node;
        if (node.declarations.length === 1) {
          const declaration = node.declarations[0];
          const name = declaration.id;
          if (name.type === "Identifier") {
            const fn = declaration.init;
            if (!fn) {
              // noop
            } else if (fn.type === "FunctionExpression") {
              const functionDecl = t.functionDeclaration(
                name,
                fn.params,
                fn.body,
                fn.generator,
                fn.async,
              );
              path.replaceWith(functionDecl);
            } else if (fn.type === "ClassExpression") {
              path.replaceWith(
                t.classDeclaration(name, fn.superClass, fn.body, fn.decorators),
              );
            }
          }
        }
      },
    },
    CallExpression: {
      exit(path) {
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
            binding?.referencePaths.forEach((referencePath) => {
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
        // calls pass the same arguments in some positions, inline those values
        // into the function body and remove the redundant
        // parameters/arguments.
        exitPath.traverse({
          VariableDeclarator: eliminateRedundantArguments,
          FunctionDeclaration: eliminateRedundantArguments,
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

        function eliminateRedundantArguments(
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
              (!init.isFunctionExpression() &&
                !init.isArrowFunctionExpression())
            ) {
              return;
            }
            bindingName = path.node.id.name;
            functionPath = init as NodePath<
              t.FunctionExpression | t.ArrowFunctionExpression
            >;
          }

          const scope = path.isFunctionDeclaration()
            ? path.scope.parent
            : path.scope;
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

          const actions: Array<ParamAction> = [];
          const leastArgumentCount = Math.min(
            params.length,
            ...callPaths.map((callPath) => callPath.node.arguments.length),
          );
          for (let argIdx = 0; argIdx < leastArgumentCount; argIdx++) {
            const param = functionPath.node.params[argIdx];
            if (!t.isIdentifier(param)) {
              // We don't support destructuring/rest/etc currently
              continue;
            }
            const { name } = param;

            const [firstPath, ...remainingCallPaths] = callPaths;
            const firstArg = firstPath.node.arguments[argIdx];
            const allArgsAreEquivalent = remainingCallPaths.every((callPath) =>
              t.isNodesEquivalent(callPath.node.arguments[argIdx], firstArg),
            );

            if (!allArgsAreEquivalent) {
              // Not relevant to us; skip to the next argIdx
              continue;
            } else if (isScalarConstant(firstArg)) {
              // Includes identifier `undefined`
              const value = firstArg;
              actions.push({ _: "substitute", argIdx, name, value });
            } else if (t.isIdentifier(firstArg)) {
              const globalName = firstArg.name;
              assert.ok(
                globalName !== "undefined",
                "`undefined` should be handled by isScalarConstantArg",
              );

              const firstArgBinding = firstPath.scope.getBinding(globalName);
              if (firstArgBinding?.scope !== exitPath.scope) {
                // Not a global identifier, skip to next argument
                continue;
              } else if (param.name === globalName) {
                // Simply eliminate so we can reference globalName directly
                actions.push({ _: "eliminate", argIdx, name });
              } else if (functionPath.scope.hasOwnBinding(globalName)) {
                // Cannot safely rename inner references for this index, skip it
                // TODO: handle renaming of conflicting variables to enable referencing global value.
              } else {
                // Rename inner references to match the globalName
                actions.push({ _: "rename", argIdx, name, to: globalName });
              }
            } else {
              // Too complex for us currently
              continue;
            }
          }

          if (actions.length === 0) {
            // Nothing to do.
            return;
          }

          let lastIdx = -1;

          // Perform rewriting of the function as necessary
          for (const action of actions) {
            const { argIdx, name: paramName } = action;

            // Guaranteed by above code
            assert.ok(argIdx > lastIdx, "arg indexes must increase");
            lastIdx = argIdx;

            switch (action._) {
              case "rename": {
                functionPath.scope.rename(paramName, action.to);
                break;
              }
              case "substitute": {
                const binding = functionPath.scope.bindings[paramName];
                if (binding?.referencePaths.length > 0) {
                  const referencePaths = [...binding.referencePaths];
                  for (const referencePath of referencePaths) {
                    referencePath.replaceWith(t.cloneNode(action.value));
                  }
                  functionPath.scope.removeBinding(paramName);
                }
                break;
              }
              case "eliminate": {
                // Eliminate only, no further action necessary
                break;
              }
              default: {
                const never: never = action;
                throw new Error(`Not understood: ${inspect(never)}`);
              }
            }
          }

          // Finally eliminate the arguments
          for (let k = actions.length - 1; k >= 0; k--) {
            const { argIdx } = actions[k];
            functionPath.node.params.splice(argIdx, 1);
            for (const callPath of callPaths) {
              callPath.node.arguments.splice(argIdx, 1);
            }
          }
        }
      },
    },
    BlockStatement: {
      exit(path) {
        const body = path.node.body;

        // If it only has two statements, the first being `const foo = ...` and the latter being `return foo` then rewrite to just `return ...`
        if (body.length === 2) {
          const [line1, line2] = body;
          if (t.isReturnStatement(line2) && t.isIdentifier(line2.argument)) {
            const identifierName = line2.argument.name;
            if (
              t.isVariableDeclaration(line1) &&
              line1.declarations.length === 1
            ) {
              const { id, init } = line1.declarations[0];
              if (t.isIdentifier(id) && id.name === identifierName) {
                // One last check: is this same variable referenced inside the function?
                const binding = path.scope.bindings[identifierName];
                if (binding == null || binding.referencePaths.length === 0) {
                  const ret = t.returnStatement(init);
                  if (path.parentPath.isBlock()) {
                    path.replaceWith(ret);
                    return;
                  } else {
                    path.replaceWith(t.blockStatement([ret]));
                    return;
                  }
                }
              }
            }
          }
        }

        // Strip it if it's inside another block and it either doesn't declare
        // any variables or is the only statement
        if (path.parentPath.isBlockStatement() || path.parentPath.isProgram()) {
          if (
            path.parentPath.node.body.length === 1 ||
            !body.some(t.isVariableDeclaration)
          ) {
            path.replaceWithMultiple(body);
          }
        }
      },
    },
    IfStatement: {
      exit(path) {
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
    },
    ConditionalExpression: {
      exit(path) {
        const test = path.node.test;
        if (expressionIsAlwaysFalsy(test)) {
          path.replaceWith(path.node.alternate);
        } else if (expressionIsAlwaysTruthy(test)) {
          path.replaceWith(path.node.consequent);
        }
      },
    },
    ObjectProperty: {
      exit(path) {
        if (!t.isIdentifier(path.node.key)) {
          return;
        }
        const func = path.node.value;
        if (
          !t.isFunctionExpression(func) &&
          !t.isArrowFunctionExpression(func)
        ) {
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
    },
  });

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
    case "NumericLiteral":
      return !test.value;
    default:
      return false;
  }
}

function expressionIsAlwaysTruthy(test: t.Expression) {
  switch (test.type) {
    case "NullLiteral":
      return false;
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
