import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";
import "codemirror/mode/javascript/javascript";
import "codemirror-graphql/hint";
import "codemirror-graphql/lint";
import "codemirror-graphql/mode";
import "graphiql/style.css";
import "@graphiql/plugin-explorer/style.css";
import "ruru-components/ruru.css";

import CodeMirror from "@uiw/react-codemirror";
import * as Grafast from "grafast";
import { grafast, makeGrafastSchema } from "grafast";
import { parse, GraphQLError } from "graphql";
import React, { useCallback, useMemo, useState } from "react";
import { Ruru } from "ruru-components";

import styles from "./styles.module.css";

const INITIAL_QUERY = `\
query Example {
  meaningOfLife: addTwoNumbers(a:37, b:5)
}
`;
const INITIAL_TYPEDEFS = `\
type Query {
  addTwoNumbers(a: Int!, b: Int!): Int
}
`;
const INITIAL_CODE = `\
const objects = {
  Query: {
    plans: {
      addTwoNumbers(_, { $a, $b }) {
        return lambda([$a, $b], ([a, b]) => a + b, true);
      },
    },
  },
};
`;

export default function PlaygroundInner() {
  const [typeDefs, setTypedefs] = useState(INITIAL_TYPEDEFS);
  const [code, setCode] = useState(INITIAL_CODE);
  const schema = useMemo(() => {
    try {
      const config = new Function(
        "Grafast",
        `\
with (Grafast) {
  ${code};
  const result = {};
  if (typeof typeDefs !== 'undefined') {
    result.typeDefs = typeDefs;
  }
  if (typeof enableDeferStream !== 'undefined') {
    result.enableDeferStream = enableDeferStream;
  }
  if (typeof plans !== 'undefined') {
    result.plans = plans;
  }
  if (typeof objects !== 'undefined') {
    result.objects = objects;
  }
  if (typeof interfaces !== 'undefined') {
    result.interfaces = interfaces;
  }
  if (typeof unions !== 'undefined') {
    result.unions = unions;
  }
  if (typeof inputObjects !== 'undefined') {
    result.inputObjects = inputObjects;
  }
  if (typeof scalars !== 'undefined') {
    result.scalars = scalars;
  }
  if (typeof enums !== 'undefined') {
    result.enums = enums;
  }
  return result;
}
`,
      )(Grafast);
      return makeGrafastSchema({
        typeDefs,
        enableDeferStream: false,
        ...config,
        ...(typeof config.typeDefs === "string"
          ? { typeDefs: parse(config.typeDefs) }
          : null),
      });
    } catch (e) {
      return e;
    }
  }, [code, typeDefs]);
  const fetcher = useCallback(
    async ({ query, operationName, variables }) => {
      if (schema instanceof Error) {
        return {
          errors: [new GraphQLError(schema)],
        };
      }
      const result = await grafast(
        {
          schema,
          source: query,
          operationName,
          variableValues: variables,
        },
        { grafast: { explain: ["plan"] } },
      );
      if (result.extensions) {
        // Hide 'extensions' so it doesn't overwhelm people
        const { extensions, ...rest } = result;
        Object.defineProperty(rest, "extensions", {
          value: extensions,
        });
        return rest;
      } else {
        return result;
      }
    },
    [schema],
  );
  return (
    <div className={styles.container}>
      <div className={styles.ruru}>
        <Ruru fetcher={fetcher} defaultQuery={INITIAL_QUERY} />
      </div>
      <div className={styles.editors}>
        <div className={styles.editor}>
          <h4>typeDefs.graphql</h4>
          <Editor lang="graphql" value={typeDefs} onValueChange={setTypedefs} />
        </div>
        <div className={styles.editor}>
          <h4>plans.js</h4>
          <Editor lang="js" value={code} onValueChange={setCode} />
        </div>
      </div>
    </div>
  );
}

const Editor = ({ value, onValueChange, lang }) => {
  const options = useMemo(() => {
    return {
      theme: "monokai",
      keyMap: "sublime",
      mode: lang,
    };
  }, [lang]);
  return (
    <CodeMirror
      lazyLoadMode={false}
      value={value}
      onChange={onValueChange}
      options={options}
    />
  );
};
