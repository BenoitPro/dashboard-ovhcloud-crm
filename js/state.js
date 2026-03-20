// Lightweight in-memory state store
// Phase 2: replace with React Query / SWR cache

let _state = {};
const _listeners = new Set();

export function getState() { return _state; }

export function setState(partial) {
  _state = { ..._state, ...partial };
  _listeners.forEach(fn => fn(_state));
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
