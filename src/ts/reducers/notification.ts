import { Map, Stack } from "immutable"
import { CLEAR_NOTIFICATION, SHOW_NOTIFICATION } from "../actions"

const initialState = Map({
  notifications: []
})

export const notificationReducer = (state = initialState, action: any) => {
  let notifications: any[] = state.getIn(["notifications"])

  switch (action.type) {
    case SHOW_NOTIFICATION:
      const notification = action.notification
      notification.createdAt = notification.createdAt || Date.now()

      return state.setIn(
        ["notifications"],
        notifications
          .concat([notification])
          .sort((a, b) => b.createdAt - a.createdAt)
      )
    case CLEAR_NOTIFICATION:
      const { notificationId } = action

      return state.setIn(
        ["notifications"],
        notifications.filter((notification) => notification.id !== notificationId)
      )
    default:
      return state
  }
}
