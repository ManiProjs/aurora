import { useSettingsStore } from "../stores/settings";

export function useAnimations() {
  return useSettingsStore((s) => s.animations);
}
