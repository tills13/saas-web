import * as _ from "lodash"

import { Dispatch } from "react-redux"
import { ThunkAction } from "redux-thunk"
import { ApplicationState } from "../store"
import { http } from "../utils/fetch"

export const GET_USER = "GET_USER"
export const GET_USERS_COMPLETED = "GET_USER"
export const LOGIN_ACTION = "LOGIN_ACTION"
export const LOGIN_COMPLETE_ACTION = "LOGIN_COMPLETE_ACTION"
export const REGISTER_ACTION = "REGISTER_ACTION"
export const REGISTER_COMPLETED_ACTION = "REGISTER_COMPLETED_ACTION"
export const LOGOUT_ACTION = "LOGOUT_ACTION"
export const LOGOUT_COMPLETED_ACTION = "LOGOUT_COMPLETED_ACTION"

export function login(data): ThunkAction<Promise<void>, ApplicationState, void> {
  return (dispatch: Dispatch<ApplicationState>): Promise<void> => {
    dispatch({ type: LOGIN_ACTION })

    return http.post("/session/login", data).then((response) => {
      if (localStorage) {
        localStorage.setItem("currentUser", JSON.stringify(response))
      }

      // dispatch({ type: LOGIN_COMPLETE_ACTION, user: new User(response) })
    })
  }
}

export function register(data): ThunkAction<Promise<void>, ApplicationState, void> {
  return (dispatch: Dispatch<ApplicationState>): Promise<void> => {
    dispatch({ type: REGISTER_ACTION })

    return http.post("/session/register", data).then((response) => {
      localStorage && localStorage.setItem("currentUser", JSON.stringify(response))
      // dispatch({ type: REGISTER_COMPLETED_ACTION, user: new User(response) })
    })
  }
}

export function logout(): ThunkAction<Promise<void>, ApplicationState, void> {
  return (dispatch: Dispatch<ApplicationState>): Promise<void> => {
    dispatch({ type: LOGOUT_ACTION })

    return http.post("/session/logout").then(() => {
      if (localStorage) {
        localStorage.removeItem("currentUser")
      }

      dispatch({ type: LOGOUT_COMPLETED_ACTION })
    }).catch((err) => {
      dispatch({ type: LOGOUT_COMPLETED_ACTION })
    })
  }
}
