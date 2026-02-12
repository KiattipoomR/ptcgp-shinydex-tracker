import { THEME_STORAGE_KEY, WebTheme } from '@/data/constants'

export const initTheme = (): WebTheme => {
  const stored = readStoredTheme()
  let theme: WebTheme

  if (stored) {
    theme = stored
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme = prefersDark ? WebTheme.Dark : WebTheme.Light
  }

  applyTheme(theme)
  return theme
}

export const setTheme = (theme: WebTheme) => {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

const readStoredTheme = (): WebTheme | null => {
  return window.localStorage.getItem(THEME_STORAGE_KEY) as WebTheme | null
}

const applyTheme = (theme: WebTheme): void => {
  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')

  if (theme === WebTheme.Light) {
    root.classList.add('theme-light')
  } else if (theme === WebTheme.Dark) {
    root.classList.add('theme-dark')
  }
}
