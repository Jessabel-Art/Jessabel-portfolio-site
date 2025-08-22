import { useState, useEffect, useRef } from "react";

const TOAST_LIMIT = 3;
const DEFAULT_DURATION = 3500;

let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastStore = {
  state: { toasts: [] },
  listeners: [],

  getState: () => toastStore.state,

  setState: (next) => {
    toastStore.state =
      typeof next === "function" ? next(toastStore.state) : { ...toastStore.state, ...next };
    toastStore.listeners.forEach((l) => l(toastStore.state));
  },

  subscribe: (listener) => {
    toastStore.listeners.push(listener);
    return () => {
      toastStore.listeners = toastStore.listeners.filter((l) => l !== listener);
    };
  },
};

/**
 * Show a toast
 * @param {Object} opts
 * @param {string} [opts.id]            custom id (so you can update later)
 * @param {number} [opts.duration]      ms; Infinity to pin
 * @param {string} [opts.title]
 * @param {string} [opts.description]
 * @param {ReactNode} [opts.action]
 */
export const toast = ({ id: idProp, duration = DEFAULT_DURATION, ...props }) => {
  const id = idProp ?? generateId();

  const dismiss = () =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));

  const update = (nextProps) =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...nextProps } : t)),
    }));

  toastStore.setState((state) => {
    // de-dupe: if last toast has same title+description within the stack, just update it
    const existingIdx = state.toasts.findIndex((t) => t.id === id);
    let nextToasts;

    if (existingIdx !== -1) {
      nextToasts = state.toasts.map((t, i) =>
        i === existingIdx ? { ...t, ...props, duration, id, dismiss } : t
      );
    } else {
      // also de-dupe by content (optional)
      const duplicate = state.toasts.find(
        (t) => t.title === props.title && t.description === props.description
      );
      nextToasts = duplicate
        ? state.toasts // skip adding duplicate
        : [{ ...props, id, duration, dismiss }, ...state.toasts];
    }

    return { ...state, toasts: nextToasts.slice(0, TOAST_LIMIT) };
  });

  return { id, dismiss, update };
};

/** Dismiss all toasts */
export const dismissAll = () =>
  toastStore.setState((state) => ({ ...state, toasts: [] }));

export function useToast() {
  const [state, setState] = useState(toastStore.getState());
  const timersRef = useRef({});

  useEffect(() => toastStore.subscribe(setState), []);

  // handle lifetimes
  useEffect(() => {
    // clear any old timers for removed toasts
    Object.keys(timersRef.current).forEach((key) => {
      if (!state.toasts.find((t) => t.id === key)) {
        clearTimeout(timersRef.current[key]);
        delete timersRef.current[key];
      }
    });

    state.toasts.forEach((t) => {
      if (t.duration === Infinity || timersRef.current[t.id]) return;
      timersRef.current[t.id] = setTimeout(() => {
        t.dismiss?.();
        delete timersRef.current[t.id];
      }, t.duration ?? DEFAULT_DURATION);
    });

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, [state.toasts]);

  return { toast, dismissAll, toasts: state.toasts };
}