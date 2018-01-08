const SESSION_TOKEN_KEY = "SaaS:token"

export const setSessionToken = (token: string) => {
  return Promise.resolve().then(() => localStorage.setItem(SESSION_TOKEN_KEY, token)).then(() => {
    return getSessionToken()
  })
}

export const getSessionToken = () => {
  return localStorage.getItem(SESSION_TOKEN_KEY)
}

export const isLoggedIn = () => {
  return !!getSessionToken()
}

export const logout = () => {
  return Promise.resolve().then(() => localStorage.removeItem(SESSION_TOKEN_KEY)).then(() => {
    return getSessionToken()
  })
}
