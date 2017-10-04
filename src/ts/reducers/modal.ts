import { HIDE_MODAL, SHOW_MODAL } from "actions"
import { Map, Stack } from "immutable"
import BaseModal from "modals/base"

type ReducerSchema<T = any> = {
  modal: BaseModal, props: T
}

export interface ModalState {
  modals?: Stack<BaseModal>
}

export interface ModalAction extends BaseModal { }

const initialState: any = Map({
  modals: Stack<ReducerSchema>()
})

export const modalReducer = (state = initialState, action: any): ModalState => {
  switch (action.type) {
    case SHOW_MODAL:
      return state.setIn(["modals"], (state.getIn(["modals"]) as Stack<ReducerSchema>).push({
        modal: action.modal,
        props: action.props
      }))
    case HIDE_MODAL:
      return state.setIn(["modals"], (state.getIn(["modals"]) as Stack<ReducerSchema>).pop())
    default:
      return state
  }
}
