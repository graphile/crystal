import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

if (ExecutionEnvironment.canUseDOM) {
  const { pathname, search, hash } = window.location;
  if (pathname.endsWith("/") && /[^/]/.test(pathname)) {
    const newUrl =
      pathname.substring(0, pathname.length - 1) +
      (search ?? "") +
      (hash ?? "");
    history.replaceState({}, "", newUrl);
  }
}
