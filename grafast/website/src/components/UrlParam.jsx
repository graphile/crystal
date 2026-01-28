export default function UrlParam({ param, fallback }) {
  const hash = typeof window !== "undefined" ? window.location.hash : null;
  const qs = hash ? hash.replace(/^#+/, "") : null;
  const params = qs ? new URLSearchParams(qs) : null;
  const val = params ? params.get(param) : null;
  return val ? <code>{val}</code> : fallback;
}
