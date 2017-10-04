import "./manager.scss"

import * as React from "react"

import { Stack } from "immutable"
import { extend } from "lodash"
import { connect } from "react-redux"
import { hideModal, showModal } from "../../actions"

export interface ModalOptions {
  preventCloseOnUnfocus?: boolean
  showCloseButton?: boolean
  [key: string]: any
}

export interface Modal {
  modal: React.ComponentClass<any>
  props?: ModalOptions
}

interface ModalManagerComponentStateProps {
  modals: Stack<Modal>
}

interface ModalManagerComponentDispatchProps {
  hideModal: () => void
  showModal: () => void
}

type ModalManagerComponentProps =
  ModalManagerComponentStateProps &
  ModalManagerComponentDispatchProps

class ModalManagerComponent extends React.Component<ModalManagerComponentProps, any> {
  closeActiveModal = () => {
    const { modals } = this.props

    const activeModal = modals.peek()
    const { preventCloseOnUnfocus, ...props } = activeModal.props

    if (!preventCloseOnUnfocus) {
      this.props.hideModal()
    }
  }

  render() {
    const { modals, hideModal } = this.props

    if (!modals || modals.size === 0) return null

    const activeModal = modals.peek()
    let { preventCloseOnUnfocus, ...props } = activeModal.props

    props = extend<{ showCloseButton: true }, ModalOptions>({ showCloseButton: true }, props)

    const mActiveModal = React.createElement(activeModal.modal, {
      ...props,
      close: hideModal
    })

    return (
      <div className="ModalManager">
        <div className="ModalManager__screen" onClick={ this.closeActiveModal } />
        { mActiveModal }
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    modals: state.modal.get("modals") as Stack<Modal>
  }
}

export const ModalManager = connect<ModalManagerComponentStateProps, ModalManagerComponentDispatchProps, any>(
  mapStateToProps, {
    hideModal,
    showModal
  }
)(ModalManagerComponent)
export default ModalManager
