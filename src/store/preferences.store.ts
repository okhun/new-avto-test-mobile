import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createResilientStorage } from "./theme.store";

type PreferencesState = {
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (enabled: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      soundEffectsEnabled: true,
      setSoundEffectsEnabled: (soundEffectsEnabled) =>
        set({ soundEffectsEnabled }),
    }),
    {
      name: "app-preferences",
      storage: createJSONStorage(() => createResilientStorage()),
    }
  )
);
