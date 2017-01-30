import Collection from '../../interface/collection/Collection'

type Timestamps = {
  created?: string;
  modified?: string;
}

function tsFromCreated (fields: mixed, created?: string): Timestamps | undefined {
  if (created && fields && fields[created]) {
    return { created }
  }
}

function tsFromModified (fields: mixed, timestamps?: Timestamps, modified?: string): Timestamps | undefined {
  if (modified && fields && fields[modified]) {
    if (timestamps) {
      timestamps.modified = modified
    } else {
      return { modified }
    }
  }
  return timestamps
}

function tsForCollection (collection: Collection<mixed>, timestamps?: Timestamps): Timestamps | undefined {
  if (!timestamps) {
    return
  }
  const fields = collection.type.fields
  let newTimestamps = tsFromCreated(fields, timestamps.created)
  return tsFromModified(fields, newTimestamps, timestamps.modified)
}
export default tsForCollection
