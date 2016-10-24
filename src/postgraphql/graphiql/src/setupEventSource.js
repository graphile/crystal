const setupEventSource = sourceUrl => ({
  onOpen,
  onChange,
  onError
}) => {
  // Starts listening to the event stream at the sourceUrl
  const source = new EventSource(sourceUrl)

  // Setup listeners for specific events
  source.addEventListener('changed', event => onChange(event), false)
  source.addEventListener('open', event => onOpen(event), false)
  source.addEventListener('error', event => onError(event), false)

  return source
}

export default setupEventSource
