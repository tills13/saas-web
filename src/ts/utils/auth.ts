const SESSION_TOKEN_KEY = "SaaS:token"

export const setSessionToken = (token: string) => {
  console.log("setSessionToken", token)
  return Promise.resolve().then(() => localStorage.setItem(SESSION_TOKEN_KEY, token)).then(() => {
    return getSessionToken()
  })
}

export const getSessionToken = () => {
  console.log("getSessionToken", localStorage.getItem(SESSION_TOKEN_KEY))
  return localStorage.getItem(SESSION_TOKEN_KEY)
}

export const isLoggedIn = () => {
  return !!getSessionToken()
}

export const logout = () => {
  console.log("logout")
  return Promise.resolve().then(() => localStorage.removeItem(SESSION_TOKEN_KEY)).then(() => {
    return getSessionToken()
  })
}
