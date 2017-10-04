import * as React from "react"
import { store } from "../../store"

import { uniqueId } from "lodash"

import { CLEAR_NOTIFICATION, SHOW_NOTIFICATION } from "actions"

export const NOTIFICATION_TIMEOUT_NO_TIMEOUT = -1

export const NOTIFICATION_TYPE_NORMAL = "NOTIFICATION_TYPE_NORMAL"
export const NOTIFICATION_TYPE_ERROR = "NOTIFICATION_TYPE_ERROR"

export function showNotification(message: string, icon?: React.ReactNode, opts: any = {}) {
  const notificationId = uniqueId("notification")

  store.dispatch({
    type: SHOW_NOTIFICATION,
    notification: {
      id: notificationId,
      message,
      icon,
      type: opts.type
    }
  })

  if (opts.timeout !== NOTIFICATION_TIMEOUT_NO_TIMEOUT) {
    window.setTimeout(() => {
      store.dispatch({
        type: CLEAR_NOTIFICATION,
        notificationId
      })
    }, opts.timeout || 2000)
  }
}

export function showErrorNotification(message: string, icon?: React.ReactNode, opts: any = {}) {
  opts.type = NOTIFICATION_TYPE_ERROR
  showNotification(message, icon, opts)
}
