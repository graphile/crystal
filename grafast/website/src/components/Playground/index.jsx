import { Ruru } from "@grafast/ruru";
import * as Grafast from "grafast";
import { grafast, makeGrafastSchema } from "grafast";
import { GraphQLError } from "graphql";
import React, { useCallback, useMemo, useState } from "react";

import styles from "./styles.module.css";

const INITIAL_TYPEDEFS = `\
type Query {
  addTwoNumbers(a: Int!, b: Int!): Int
}
`;
const INITIAL_CODE = `\
const plans = {
  Query: {
    addTwoNumbers(_, args) {
      const $a = args.get("a");
      const $b = args.get("b");
      return lambda([$a, $b], ([a, b]) => a + b);
    },
  },
};
`;

export default function Playground() {
  const [typeDefs, setTypedefs] = useState(INITIAL_TYPEDEFS);
  const [code, setCode] = useState(INITIAL_CODE);
  const schema = useMemo(() => {
    try {
      const plans = new Function(
        "Grafast",
        `\
with (Grafast) {
  ${code};
  return plans;
}
`,
      )(Grafast);
      return makeGrafastSchema({
        typeDefs,
        plans,
        enableDeferStream: false,
      });
    } catch (e) {
      return e;
    }
  }, [code, typeDefs]);
  const fetcher = useCallback(
    ({ query, operationName, variables }) => {
      if (schema instanceof Error) {
        return {
          errors: [new GraphQLError(schema)],
        };
      }
      return grafast(
        {
          schema,
          source: query,
          operationName,
          variableValues: variables,
        },
        { explain: ["mermaid-js"] },
      );
    },
    [schema],
  );
  return (
    <div className={styles.container}>
      <div className={styles.ruru}>
        <Ruru fetcher={fetcher} />
      </div>
      <div className={styles.editors}>
        <div className={styles.editor}>
          <textarea
            value={typeDefs}
            onChange={(e) => setTypedefs(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.editor}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
