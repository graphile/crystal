import { ResolveTree } from "graphql-parse-resolve-info";
import { Build, Scope } from "graphile-build";
import { SQL } from "pg-sql2";
import QueryBuilder from "../QueryBuilder";

type FieldContext<T> = any;
type FieldWithHooksFunction = any;

interface PgFieldOptions<T> {
  hoistCursor?: boolean;
  withQueryBuilder?: (
    queryBuilder: QueryBuilder,
    args: { parsedResolveInfoFragment: ResolveTree }
  ) => void;
}

export default function pgField<T>(
  build: Build,
  fieldWithHooks: FieldWithHooksFunction,
  fieldName: string,
  fieldSpecGenerator: T | ((fieldContext: FieldContext<T>) => T),
  fieldScope: Scope<T>,
  whereFrom?: false | ((queryBuilder: QueryBuilder) => SQL),
  options?: PgFieldOptions<T>
): T;
