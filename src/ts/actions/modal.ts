export const SHOW_MODAL = "SHOW_MODAL"
export const HIDE_MODAL = "HIDE_MODAL"

export function showModal<T>(modal, props?: T) {
  return { type: SHOW_MODAL, modal, props }
}

export function hideModal() {
  return { type: HIDE_MODAL }
}
