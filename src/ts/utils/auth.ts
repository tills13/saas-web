import { pick } from "lodash"
import Relay, { graphql } from "react-relay"

import Environment from "relay/environment"

const SESSION_TOKEN_KEY = "SaaS:token"

export const UpdateViewerQuery = graphql`
  query auth_UpdateViewerQuery {
    viewer { id, username }
  }
`

export type LoginData = { username: string, password: string }
export type RegisterData = LoginData & { email: string }

export function refreshViewer () {
  return Relay.fetchQuery(Environment, UpdateViewerQuery, {}, { force: true })
}

export async function handleResponse<T = any> (response: Response): Promise<T> {
  try {
    const json = await response.json()

    if (!response.ok) {
      throw new Error((json && json.err) || "Something went wrong")
    }

    return json
  } catch (err) {
    throw new Error(typeof err === "string" ? err : err.message)
  }
}

export function login (data: LoginData) {
  const mData = pick(data, [ "username", "password" ])

  const options: RequestInit = {
    body: JSON.stringify(mData),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  }

  return fetch("/api/login", options)
    .then(handleResponse, handleResponse)
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
