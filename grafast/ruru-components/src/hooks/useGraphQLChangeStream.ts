import { useEffect, useRef, useState } from "react";

import type { RuruProps } from "../interfaces.js";

export const useGraphQLChangeStream = (
  props: RuruProps,
  refetch: () => void,
  streamEndpoint: string | null,
) => {
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Starts listening to the event stream at the `sourceUrl`.
  useEffect(() => {
    eventSourceRef.current = streamEndpoint
      ? new EventSource(streamEndpoint, props.eventSourceInit)
      : null;
    const eventSource = eventSourceRef.current;
    return () => {
      if (eventSource) {
        eventSource.close();
        if (eventSourceRef.current !== eventSource) {
          console.error(
            "Logic error in EventSource handling in useGraphQLChangeStream",
          );
        }
        eventSourceRef.current = null;
      }
    };
  }, [streamEndpoint]);

  const eventSource = eventSourceRef.current;
  useEffect(() => {
    if (eventSource) {
      if (eventSource.readyState === eventSource.CLOSED) {
        console.warn("Ruru: EventSource is closed, reopening");
        setError(new Error("Ruru: EventSource is closed, reopening"));
      }

      const onOpen = () => {
        console.log("Ruru: Listening for server sent events");
        setError(null);
        refetch();
      };
      const onError = (error: Event) => {
        console.error("Ruru: Failed to connect to event stream", error);
        setError(new Error("Failed to connect to event stream"));
      };

      // When we get a change notification, we want to update our schema.
      eventSource.addEventListener("change", refetch, false);
      // Add event listeners that just log things in the console.
      eventSource.addEventListener("open", onOpen, false);
      eventSource.addEventListener("error", onError, false);

      // Make sure to unsubscribe when we're not needed any more.
      return () => {
        eventSource.removeEventListener("change", refetch, false);
        eventSource.removeEventListener("open", onOpen, false);
        eventSource.removeEventListener("error", onError, false);
      };
    }
  }, [error, eventSource, refetch, streamEndpoint]);
  return { error };
};
