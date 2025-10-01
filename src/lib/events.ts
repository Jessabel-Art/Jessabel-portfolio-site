// simple pub/sub for cross-component triggers
type Handler = () => void;
const listeners = new Set<Handler>();
export const burstEvents = {
  on: (h: Handler) => listeners.add(h),
  off: (h: Handler) => listeners.delete(h),
  emit: () => listeners.forEach((h) => h()),
};
