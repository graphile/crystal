import React, { FC, useMemo } from "react";
import ReactDOM from "react-dom";

import GraphiQL, { GraphiQLProps } from "graphiql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import GraphiQLExplorer from "graphiql-explorer";

export const GraphileInspect: FC<GraphileInspectProps> = (props) => {
  const fetcher = useFetcher(props);
  const schema = useSchema(props, fetcher);
  const GraphiQLAny = GraphiQL as any;
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <GraphiQLExplorer
        schema={schema}
        query={this.state.query}
        onEdit={this.handleEditQuery}
        onRunOperation={(operationName) =>
          this.graphiql.handleRunQuery(operationName)
        }
        explorerIsOpen={this.state.explorerIsOpen}
        onToggleExplorer={this.handleToggleExplorer}
      />
      <GraphiQLAny
        fetcher={fetcher}
        editorTheme={props.editorTheme ?? "dracula"}
      >
        <GraphiQL.Logo>Graphile Inspect</GraphiQL.Logo>
        <GraphiQL.Footer>
          <div style={{ padding: 7 }}>
            <a title="graphile.org" href="https://graphile.org/" target="new">
              graphile.org
            </a>{" "}
            |{" "}
            <a
              title="Graphile is supported by the community, please sponsor ongoing development"
              href="https://graphile.org/sponsor/"
              target="new"
            >
              Sponsor
            </a>{" "}
            |{" "}
            <a
              title="Get support from the team behind PostGraphile"
              href="https://graphile.org/support/"
              target="new"
            >
              Support
            </a>
          </div>
        </GraphiQL.Footer>
      </GraphiQLAny>
    </div>
  );
};
