export default function parseIdentifier(
  typeIdentifier: string
): { namespaceName: string; entityName: string } {
  const match = typeIdentifier.match(
    /^(?:([a-zA-Z0-9_]+)|"([^"]*)")\.(?:([a-zA-Z0-9_]+)|"([^"]*)")$/
  );

  if (!match)
    throw new Error(
      `Type identifier '${typeIdentifier}' is of the incorrect form.`
    );

  return {
    namespaceName: match[1] || match[2],
    entityName: match[3] || match[4],
  };
}
