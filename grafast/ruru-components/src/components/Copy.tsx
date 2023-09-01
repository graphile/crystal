import type { FC } from "react";
import { useCallback, useMemo, useRef } from "react";

export const Copy: FC<{
  text?: string;
  json?: any;
  children: string | JSX.Element | JSX.Element[];
}> = ({ text: rawText, json, children }) => {
  const text = useMemo(
    () => rawText ?? (json !== undefined ? JSON.stringify(json) : undefined),
    [rawText, json],
  );
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const copy = useCallback(() => {
    const el = ref.current;
    if (el) {
      /* Select the text field */
      el.select();
      el.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      navigator.clipboard.writeText(el.value);
    }
  }, []);
  return (
    <>
      <textarea
        ref={(el) => {
          ref.current = el;
        }}
        value={text}
        readOnly
        style={{ display: "none" }}
      />
      <button onClick={copy}>{children}</button>
    </>
  );
};
