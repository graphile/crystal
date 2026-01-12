import { useGraphiQL } from "@graphiql/react";
import { lexicographicSortSchema, printSchema } from "graphql";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";

function useToggle(initialState = false) {
  const [checked, setChecked] = useState(initialState);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  }, []);
  return useMemo(() => ({ checked, onChange }), [checked, onChange]);
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
  const schema = useGraphiQL((sel) => sel.schema);
  const sdl = useMemo(() => {
    if (!schema) return null;
    let toExport = schema;
    if (sort.checked) {
      toExport = lexicographicSortSchema(toExport);
    }
    const string = printSchema(toExport) + "\n";
    return string;
  }, [schema, sort.checked]);
  const submit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      if (!sdl) {
        setError(new Error("Schema is not available to be exported"));
        return;
      }
      download(sdl, "schema.graphql");
    },
    [sdl],
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
            <input type="checkbox" {...sort} /> Lexicographically sorted
          </label>
        </p>
        {error ? <p className="error">{error.message}</p> : null}
        <div>
          <button type="submit">Download</button>
          <button type="button" onClick={copy}>
            Copy
          </button>
        </div>
      </form>
      <pre>
        <code>{sdl}</code>
      </pre>{" "}
    </div>
  );
};
