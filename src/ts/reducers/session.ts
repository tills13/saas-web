import { Map } from "immutable"
import {
  GET_USER,
  LOGIN_COMPLETE_ACTION,
  LOGOUT_COMPLETED_ACTION,
  REGISTER_COMPLETED_ACTION
} from "../actions/session"

export interface SessionState {
  currentUser?: Models.UserInterface
}

interface SessionAction {
  user: Models.UserInterface
}

const initialState: any = Map({
  currentUser: null
})

export const sessionReducer = (state = initialState, action: any): SessionState => {
  switch (action.type) {
    case GET_USER:
    case REGISTER_COMPLETED_ACTION:
    case LOGIN_COMPLETE_ACTION:
      return state.set("currentUser", action.user)
    case LOGOUT_COMPLETED_ACTION:
      return state.remove("currentUser")
    default:
      return state
  }
}
