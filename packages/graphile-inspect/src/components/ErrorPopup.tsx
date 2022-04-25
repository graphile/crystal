import type { FC } from "react";

// TODO: this needs proper design and accessibility considerations

export const ErrorPopup: FC<{ error: Error; onClose: () => void }> = ({
  error,
  onClose,
}) => (
  <div
    style={{
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#ff9999",
      border: "1px solid black",
      borderRadius: 7,
      width: "20rem",
      maxWidth: "90vw",
    }}
  >
    <button
      style={{
        float: "right",
        background: "transparent",
        border: "none",
        marginLeft: 10,
        marginBottom: 10,
      }}
      onClick={onClose}
    >
      🗙
    </button>
    <div style={{ padding: 10 }}>{String(error)}</div>
  </div>
);
