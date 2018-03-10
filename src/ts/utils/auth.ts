const SESSION_TOKEN_KEY = "SaaS:token"

export const setSessionToken = (token: string) => {
  localStorage.setItem(SESSION_TOKEN_KEY, token)
  return getSessionToken()
}

export const getSessionToken = () => {
  return localStorage.getItem(SESSION_TOKEN_KEY)
}

export const isLoggedIn = () => {
  return !!getSessionToken()
}

export const logout = () => {
  localStorage.removeItem(SESSION_TOKEN_KEY)
}
