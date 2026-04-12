const AUTH_SESSION_HINT_KEY = 'sharlushka_auth_session'
const AUTH_SESSION_HINT_VALUE = '1'

export const hasAuthSessionHint = (): boolean => {
  try {
    return (
      window.localStorage.getItem(AUTH_SESSION_HINT_KEY) ===
      AUTH_SESSION_HINT_VALUE
    )
  } catch {
    return false
  }
}

export const setAuthSessionHint = (): void => {
  try {
    window.localStorage.setItem(
      AUTH_SESSION_HINT_KEY,
      AUTH_SESSION_HINT_VALUE
    )
  } catch {
    // Storage access can fail in private mode or restricted environments.
  }
}

export const clearAuthSessionHint = (): void => {
  try {
    window.localStorage.removeItem(AUTH_SESSION_HINT_KEY)
  } catch {
    // Storage access can fail in private mode or restricted environments.
  }
}
