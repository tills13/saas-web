export const CLEAR_NOTIFICATION = "CLEAR_NOTIFICATION"
export const HIDE_NOTIFICATION = "HIDE_NOTIFICATION"
export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION"

export function showNotification<T>(notification) {
  return { type: SHOW_NOTIFICATION, notification }
}

export function hideNotification() {
  return { type: HIDE_NOTIFICATION }
}
