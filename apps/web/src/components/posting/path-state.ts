export type PathState = Record<string, unknown>;

/**
 * Read a dot-path value (e.g. `tk_safety.allow_comments`) out of a nested state
 * object. Returns `undefined` if any segment is missing or not traversable.
 */
export function getPath(state: PathState, path: string): unknown {
  const parts = path.split(".");
  let cursor: unknown = state;
  for (const part of parts) {
    if (cursor === null || cursor === undefined) {
      return;
    }
    if (typeof cursor !== "object") {
      return;
    }
    cursor = (cursor as Record<string, unknown>)[part];
  }
  return cursor;
}

/**
 * Produce a new state object with the dot-path set to `value`. Existing
 * parent objects are cloned shallowly; primitives are replaced. Used by the
 * platform settings form to bridge flat field names (`tk_safety.allow_duet`)
 * into the nested payload shape expected by the publish endpoint.
 */
export function setPath(
  state: PathState,
  path: string,
  value: unknown
): PathState {
  const parts = path.split(".");
  const next: PathState = { ...state };
  let cursor: PathState = next;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const existing = cursor[key];
    const isObject =
      typeof existing === "object" &&
      existing !== null &&
      !Array.isArray(existing);
    const branch: PathState = isObject ? { ...(existing as PathState) } : {};
    cursor[key] = branch;
    cursor = branch;
  }

  cursor[parts.at(-1) as string] = value;
  return next;
}
