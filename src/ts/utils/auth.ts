import { pick } from "lodash"
import Relay, { graphql } from "react-relay"

import Environment from "relay/environment"

const SESSION_TOKEN_KEY = "SaaS:token"

export const UpdateViewerQuery = graphql`
  query auth_UpdateViewerQuery {
    viewer { id, username }
  }
`

type LoginData = { username: string, password: string }
type RegisterData = LoginData & { email: string }

export function refreshViewer () {
  return Relay.fetchQuery(Environment, UpdateViewerQuery, null, { force: true })
}

export function login (data) {
  const mData = pick(data, [ "username", "password" ])

  const options: RequestInit = {
    body: JSON.stringify(mData),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  }

  return fetch("/api/login", options)
    .then(response => response.json())
    .then(responseJson => {
      return setSessionToken(responseJson.token)
    })
}

export function logout () {
  localStorage.removeItem(SESSION_TOKEN_KEY)
  return refreshViewer()
}

export function register (data: RegisterData) {
  const mData = pick(data, [ "username", "password", "email" ])

  const options: RequestInit = {
    body: JSON.stringify(mData),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  }

  return fetch("/api/register", options)
    .then(response => response.json())
    .then(responseJson => {
      return setSessionToken(responseJson.token)
    })
}

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
