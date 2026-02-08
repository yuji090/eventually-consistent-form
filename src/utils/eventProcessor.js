export function createEventProcessor() {
  // latest timestamp seen per ID
  const latestTimestamp = new Map();

  // IDs that are permanently deleted
  const deleted = new Set();

  // currently active IDs
  const active = new Set();

  function process(event) {
    const { id, timestamp, type } = event;

    // Rule 1: deleted items should never reappear
    if (deleted.has(id)) return { ignored: "already_deleted" };

    const lastTs = latestTimestamp.get(id) ?? -Infinity;

    // Rule 2: ignore late or duplicate events
    if (timestamp <= lastTs) {
      return { ignored: "late_or_duplicate" };
    }

    // update latest timestamp
    latestTimestamp.set(id, timestamp);

    if (type === "deleted") {
      deleted.add(id);
      active.delete(id);
      return { applied: "deleted" };
    }

    // created / updated
    active.add(id);
    return { applied: type };
  }

  function getActive() {
    return Array.from(active);
  }

  return {
    process,
    getActive,
  };
}
