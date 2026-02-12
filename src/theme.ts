export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'shinydex:theme'

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (raw === 'light' || raw === 'dark') {
    return raw
  }
  return null
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')

  if (theme === 'light') {
    root.classList.add('theme-light')
  } else if (theme === 'dark') {
    root.classList.add('theme-dark')
  }
  // system: no explicit class, let prefers-color-scheme decide
}

export function initTheme(): Theme {
  const stored = readStoredTheme()
  let theme: Theme

  if (stored) {
    theme = stored
  } else if (typeof window !== 'undefined' && 'matchMedia' in window) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme = prefersDark ? 'dark' : 'light'
  } else {
    theme = 'light'
  }

  applyTheme(theme)
  return theme
}

export function setTheme(theme: Theme): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }
  applyTheme(theme)
}
