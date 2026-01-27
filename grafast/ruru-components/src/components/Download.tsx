import { useGraphiQL } from "@graphiql/react";
import { lexicographicSortSchema, printSchema } from "grafast/graphql";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { transformSchema } from "../utils/transformSchema.ts";

function useToggle(initialState = false) {
  const [checked, setChecked] = useState(initialState);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  }, []);
  const reset = useCallback(
    () => void setChecked(initialState),
    [initialState],
  );
  return useMemo(
    () => ({
      checked,
      setChecked,
      reset,
      changed: checked !== initialState,
      attrs: { checked, onChange },
    }),
    [checked, initialState, onChange, reset],
  );
}

function download(
  contents: string,
  filename: string,
  type = "application/graphql",
) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export const Download: FC = () => {
  const [error, setError] = useState<Error | null>(null);

  const sort = useToggle(false);
  const descs = useToggle(true);
  const depr = useToggle(true);
  const changed = sort.changed || descs.changed || depr.changed;
  const reset = useCallback(() => {
    sort.reset();
    descs.reset();
    depr.reset();
  }, [depr, descs, sort]);

  const schema = useGraphiQL((sel) => sel.schema);
  const sdl = useMemo(() => {
    if (!schema) return null;
    let toExport = schema;

    if (!descs.checked || !depr.checked) {
      toExport = transformSchema(toExport, {
        trimDescriptions: !descs.checked,
        trimDeprecated: !depr.checked,
      });
    }

    if (sort.checked) {
      toExport = lexicographicSortSchema(toExport);
    }

    const string = printSchema(toExport) + "\n";
    return string;
  }, [schema, descs.checked, depr.checked, sort.checked]);
  const submit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      if (!sdl) {
        setError(new Error("Schema is not available to be exported"));
        return;
      }
      const filenameParts = ["schema"];
      if (!depr.checked) {
        filenameParts.push("no-deprecated");
      }
      if (!descs.checked) {
        filenameParts.push("no-descriptions");
      }
      if (sort.checked) {
        filenameParts.push("sorted");
      }
      download(sdl, `${filenameParts.join(".")}.graphql`);
    },
    [depr.checked, descs.checked, sdl, sort.checked],
  );
  const copy = useCallback(
    (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setError(null);
      if (!sdl) {
        setError(new Error("Schema is not available to be copied"));
        return;
      }
      navigator.clipboard.writeText(sdl).catch((e) => {
        setError(new Error("Error copying text to clipboard", { cause: e }));
      });
    },
    [sdl],
  );
  return (
    <div>
      <form onSubmit={submit}>
        <p>
          <label>
            <input type="checkbox" {...sort.attrs} /> Sorted (lexicographically)
          </label>
          <br />
          <label>
            <input type="checkbox" {...descs.attrs} /> Include descriptions
          </label>
          <br />
          <label>
            <input type="checkbox" {...depr.attrs} /> Include deprecated
          </label>
        </p>
        {error ? <p className="error">{error.message}</p> : null}
        <div>
          <button type="submit">Download</button>
          <button type="button" onClick={copy}>
            Copy
          </button>
          <button type="button" disabled={!changed} onClick={reset}>
            Reset
          </button>
        </div>
      </form>
      <pre style={{ fontSize: "0.75rem" }}>
        <code>{sdl}</code>
      </pre>{" "}
    </div>
  );
};
