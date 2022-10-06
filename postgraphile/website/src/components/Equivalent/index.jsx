import React from "react";

export default function Equivalent({ children }) {
  return (
    <>
      {" "}
      <span
        style={{
          width: "auto",
          display: "inline",
          color: "black",
          borderRadius: "0.5rem",
          backgroundColor: "rgb(176, 215, 249)",
          padding: "0.1rem 0.4rem 0.2rem",
          //marginLeft: "-0.4rem",
          marginLeft: "0.5rem",
          whiteSpace: "pre",
          fontSize: "0.8rem",
        }}
      >
        <em>Equivalent to</em>:{" "}
        <code
          style={{
            fontSize: "0.65rem",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          }}
        >
          {children}
        </code>
      </span>
      <br />
    </>
  );
}
