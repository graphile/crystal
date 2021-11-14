export function FN<T>(
  t: T,
  $$scope: { [key: string]: any } | undefined = undefined,
): T {
  if ($$scope) {
    return Object.assign(t, { $$scope });
  } else {
    return t;
  }
}
