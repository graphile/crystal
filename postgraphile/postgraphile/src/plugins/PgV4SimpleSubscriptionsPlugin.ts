import { jsonParse } from "@dataplan/json";
import type { ObjectPlan, Step } from "grafast";
import { context, get, lambda, listen, node } from "grafast";
import { EXPORTABLE, extendSchema, gql } from "graphile-utils";

export const PgV4SimpleSubscriptionsPlugin = extendSchema((build) => {
  const {
    grafast: { get },
  } = build;
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
    objects: {
      Subscription: {
        plans: {
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
      } as ObjectPlan<Step>,
      ListenPayload: {
        plans: {
          event: EXPORTABLE(
            (get) => ($event) => {
              return get($event, "event");
            },
            [get],
          ),
          ...(nodeIdHandlerByTypeName
            ? {
                relatedNodeId: EXPORTABLE(
                  (nodeIdFromEvent) => ($event) => {
                    return nodeIdFromEvent($event);
                  },
                  [nodeIdFromEvent],
                ),
                relatedNode: EXPORTABLE(
                  (node, nodeIdFromEvent, nodeIdHandlerByTypeName) =>
                    ($event) => {
                      const $nodeId = nodeIdFromEvent($event);
                      return node(nodeIdHandlerByTypeName, $nodeId);
                    },
                  [node, nodeIdFromEvent, nodeIdHandlerByTypeName],
                ),
              }
            : null),
        },
      } as ObjectPlan<Step<{ event: string; __node__?: any[] }>>,
    },
  };
}, "PgV4SimpleSubscriptionsPlugin");

// base64JSON codec copy
const nodeObjToNodeId = EXPORTABLE(
  () =>
    function nodeObjToNodeId(obj: any[] | undefined): string | null {
      if (!obj) return null;
      return Buffer.from(JSON.stringify(obj), "utf8").toString("base64");
    },
  [],
  "nodeObjToNodeId",
);

// WARNING: this function assumes that you're using the `base64JSON` NodeID codec, which was the case for PostGraphile V4. If you are not doing so, YMMV.
const nodeIdFromEvent = EXPORTABLE(
  (get, lambda, nodeObjToNodeId) =>
    function nodeIdFromEvent($event: Step<{ __node__?: any[] }>) {
      const $nodeObj = get($event, "__node__");
      const $nodeId = lambda($nodeObj, nodeObjToNodeId);
      return $nodeId;
    },
  [get, lambda, nodeObjToNodeId],
  "nodeIdFromEvent",
);
