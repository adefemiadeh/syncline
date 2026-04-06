// src/store/settingsStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsStore {
  pushNotifications: boolean;
  darkMode: boolean;
  emailNotifications: boolean;
  togglePush: () => void;
  toggleDarkMode: () => void;
  toggleEmail: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      pushNotifications: true,
      darkMode: false,
      emailNotifications: true,

      togglePush: () =>
        set((state) => ({
          pushNotifications: !state.pushNotifications,
        })),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      toggleEmail: () =>
        set((state) => ({
          emailNotifications: !state.emailNotifications,
        })),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
