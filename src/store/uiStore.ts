import { readStorageValue, removeStorageValue, writeStorageValue } from '@/services/storageService'

const THEME_KEY = 'smart-finance.theme'

export type ThemeMode = 'light' | 'dark' | 'system'

export const uiStore = {
  get theme() {
    return readStorageValue<ThemeMode>(THEME_KEY, 'light')
  },
  setTheme(theme: ThemeMode) {
    writeStorageValue(THEME_KEY, theme)
  },
  resetTheme() {
    removeStorageValue(THEME_KEY)
  },
}