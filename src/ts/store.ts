import { RouterState } from "react-router-redux"
import { applyMiddleware, compose, createStore } from "redux"
import { FormStateMap } from "redux-form"
import { createLogger } from "redux-logger"
import { reducer } from "./reducers"
import { ModalState } from "./reducers/modal"
import { SessionState } from "./reducers/session"

import thunk from "redux-thunk"

export interface ApplicationState {
  form: FormStateMap
  modal: ModalState
  routing: RouterState
  session: SessionState
}

const logger = createLogger({ collapsed: true })
const mCompose = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] ?
  window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose :
  compose

export const store = createStore<ApplicationState>(
  reducer,
  mCompose(applyMiddleware(thunk, logger))
)
