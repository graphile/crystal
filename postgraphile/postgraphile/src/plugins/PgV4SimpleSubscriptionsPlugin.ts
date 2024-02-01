import type { JSONParseStep } from "@dataplan/json";
import { jsonParse } from "@dataplan/json";
import { context, lambda, listen, node } from "grafast";
import { EXPORTABLE, gql, makeExtendSchemaPlugin } from "graphile-utils";

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
            (context, jsonParse, lambda, listen) =>
              function subscribePlan(_$root, { $topic }) {
                const $pgSubscriber = context().get("pgSubscriber");
                const $derivedTopic = lambda(
                  $topic,
                  (topic) => `postgraphile:${topic}`,
                );
                return listen($pgSubscriber, $derivedTopic, jsonParse);
              },
            [context, jsonParse, lambda, listen],
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
        event: EXPORTABLE(() => ($event) => {
          return $event.get("event");
        }, []),
        ...(nodeIdHandlerByTypeName
          ? {
              relatedNodeId: EXPORTABLE((nodeIdFromEvent) => ($event) => {
                return nodeIdFromEvent($event);
              }, [nodeIdFromEvent]),
              relatedNode: EXPORTABLE((node, nodeIdFromEvent, nodeIdHandlerByTypeName) => ($event) => {
                const $nodeId = nodeIdFromEvent($event);
                return node(nodeIdHandlerByTypeName, $nodeId);
              }, [node, nodeIdFromEvent, nodeIdHandlerByTypeName]),
            }
          : null),
      },
    },
  };
}, "PgV4SimpleSubscriptionsPlugin");

// base64JSON codec copy
const nodeObjToNodeId = EXPORTABLE(() => function nodeObjToNodeId(obj: any[] | undefined): string | null {
  if (!obj) return null;
  return Buffer.from(JSON.stringify(obj), "utf8").toString("base64");
}, []);

// WARNING: this function assumes that you're using the `base64JSON` NodeID codec, which was the case for PostGraphile V4. If you are not doing so, YMMV.
const nodeIdFromEvent = EXPORTABLE((lambda, nodeObjToNodeId) => function nodeIdFromEvent($event: JSONParseStep<{ __node__?: any[] }>) {
  const $nodeObj = $event.get("__node__");
  const $nodeId = lambda($nodeObj, nodeObjToNodeId);
  return $nodeId;
}, [lambda, nodeObjToNodeId]);

