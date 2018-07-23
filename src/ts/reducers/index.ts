import { modalReducer } from "./modal"
import { notificationReducer } from "./notification"
import { sessionReducer } from "./session"

import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"

type ReducerSchema = any

export const reducer = combineReducers<ReducerSchema>({
  form: formReducer,
  modal: modalReducer,
  notification: notificationReducer,
  session: sessionReducer
})
