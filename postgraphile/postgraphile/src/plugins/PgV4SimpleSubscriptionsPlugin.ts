import { JSONParseStep, jsonParse } from "@dataplan/json";
import { context, lambda, listen, node } from "grafast";
import { makeExtendSchemaPlugin, gql, EXPORTABLE } from "graphile-utils";

export const PgV4SimpleSubscriptionsPlugin = makeExtendSchemaPlugin((build) => {
  const nodeIdHandlerByTypeName = build.getNodeIdHandlerByTypeName?.();
  return {
    typeDefs: [
      gql`
        extend type Subscription {
          listen(topic: String!): ListenPayload
        }

        type ListenPayload {
          event: String
        }
      `,
      ...// Only add the relatedNode if supported
      (nodeIdHandlerByTypeName
        ? [
            gql`
              extend type ListenPayload {
                relatedNode: Node
                relatedNodeId: ID
              }
            `,
          ]
        : []),
    ],
    plans: {
      Subscription: {
        listen: {
          subscribePlan: EXPORTABLE(
            (context, jsonParse, listen) =>
              function subscribePlan(_$root, { $topic }) {
                const $pgSubscriber = context().get("pgSubscriber");
                const $derivedTopic = lambda(
                  $topic,
                  (topic) => `postgraphile:${topic}`,
                );
                return listen($pgSubscriber, $derivedTopic, jsonParse);
              },
            [context, jsonParse, listen],
          ),
          plan: EXPORTABLE(
            () =>
              function plan($event) {
                return $event;
              },
            [],
          ),
        },
      },
      ListenPayload: {
        event($event) {
          return $event.get("event");
        },
        ...(nodeIdHandlerByTypeName
          ? {
              relatedNodeId($event) {
                return nodeIdFromEvent($event);
              },
              relatedNode($event) {
                const $nodeId = nodeIdFromEvent($event);
                return node(nodeIdHandlerByTypeName, $nodeId);
              },
            }
          : null),
      },
    },
  };
}, "PgV4SimpleSubscriptionsPlugin");

// WARNING: this function assumes that you're using the `base64JSON` NodeID codec, which was the case for PostGraphile V4. If you are not doing so, YMMV.
function nodeIdFromEvent($event: JSONParseStep<{ __node__?: any[] }>) {
  const $nodeObj = $event.get("__node__");
  const $nodeId = lambda($nodeObj, nodeObjToNodeId);
  return $nodeId;
}

// base64JSON codec copy
function nodeObjToNodeId(obj: any[] | undefined): string | null {
  if (!obj) return null;
  return Buffer.from(JSON.stringify(obj), "utf8").toString("base64");
}
