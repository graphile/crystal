import { useEffect, useMemo, useState } from "react";
import { GraphileInspectProps } from "../interfaces.js";

export const useGraphQLChangeStream = (
  props: GraphileInspectProps,
  refetch: () => void,
) => {
  const [error, setError] = useState<Error | null>(null);
  const eventSource = useMemo(() => {
    return props.streamEndpoint ? new EventSource(props.streamEndpoint) : null;
  }, []);

  // Starts listening to the event stream at the `sourceUrl`.
  useEffect(() => {
    if (eventSource) {
      if (eventSource.readyState === eventSource.CLOSED) {
        throw new Error("Lifecycle management error for EventSource");
      }
      // When we get a change notification, we want to update our schema.
      eventSource.addEventListener("change", refetch, false);

      // Add event listeners that just log things in the console.
      eventSource.addEventListener(
        "open",
        () => {
          console.log("Graphile Inspect: Listening for server sent events");
          setError(null);
          refetch();
        },
        false,
      );
      eventSource.addEventListener(
        "error",
        (error) => {
          console.error(
            "Graphile Inspect: Failed to connect to event stream",
            error,
          );
          setError(new Error("Failed to connect to event stream"));
        },
        false,
      );

      // Make sure to unsubscribe when we're not needed any more.
      return () => {
        eventSource.close();
      };
    }
  }, [eventSource, refetch]);
};
