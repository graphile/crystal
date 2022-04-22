import { FC } from "react";

export const ErrorPopup: FC<{ error: Error }> = ({ error }) => (
  <div
    style={{
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "#ff9999",
      padding: 10,
      border: "1px solid black",
      borderRadius: 5,
    }}
  >
    {String(error)}
  </div>
);
