export const DEFAULT_WEBSOCKET_KEEPALIVE = 12_000;
import type WebSocket from "ws";

export function handleWebSocketKeepalive(
  socket: WebSocket,
  preset: GraphileConfig.ResolvedPreset,
): void {
  const keepaliveInterval =
    preset.grafserv?.websocketKeepalive ?? DEFAULT_WEBSOCKET_KEEPALIVE;
  if (!Number.isFinite(keepaliveInterval) || keepaliveInterval <= 0) {
    // Keepalive disabled
    return;
  }

  /**
   * Sending a ping and waiting for a pong are mutually exclusive, so this
   * timer is used for both.
   */
  let timer: NodeJS.Timeout | null = null;

  /**
   * Cleans up the timer, always call this before re-assigning timer (to ensure
   * that an out-of-order pong doesn't cause two timers to run concurrently).
   */
  const stopTimer = () => {
    if (timer != null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  /** First half of a heart beat - send ping */
  const sendPing = () => {
    stopTimer();
    // Schedule timeout
    timer = setTimeout(handleTimeout, keepaliveInterval);
    socket.ping();
  };
  /** Second half of a heart beat - receive pong */
  const handlePong = () => {
    stopTimer();
    // Schedule the next ping
    timer = setTimeout(sendPing, keepaliveInterval);
  };

  /** Terminal handler, due to timeout */
  const handleTimeout = () => {
    stopTimer();
    releaseListeners();
    // Kill the socket (after we've released the listeners)
    socket.terminate();
  };
  /** Terminal handler, due to natural socket close */
  const handleClose = (_code: number, _reason: Buffer) => {
    stopTimer();
    releaseListeners();
  };

  const releaseListeners = () => {
    socket.off("pong", handlePong);
    socket.off("close", handleClose);
  };
  socket.on("pong", handlePong);
  socket.on("close", handleClose);

  // Schedule the first ping
  timer = setTimeout(sendPing, keepaliveInterval);
}
