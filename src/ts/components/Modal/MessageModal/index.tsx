import "./index.scss"

import classnames from "classnames"
import React from "react"

import ButtonGroup from "../../ButtonGroup"
import Button from "../../Button"
import BaseModal, { BaseModalProps } from "../BaseModal"

import Color from "enums/Color"
import Modal from "..";

export interface MessageModalProps {
  body: string | JSX.Element
  onClickPrimaryButton?: () => void
  onClickSecondaryButton?: () => void
  primaryButtonColor?: Color
  primaryButtonText?: string
  secondaryButtonColor?: Color
  secondaryButtonText?: string
  title?: string | JSX.Element
}

class MessageModal extends React.Component<MessageModalProps & BaseModalProps, any> {
  onClickPrimaryButton = () => {
    const { close, onClickPrimaryButton } = this.props

    if (onClickPrimaryButton) {
      onClickPrimaryButton()
    }

    close()
  }

  onClickSecondaryButton = () => {
    const { close, onClickSecondaryButton } = this.props

    if (onClickSecondaryButton) {
      onClickSecondaryButton()
    }

    close()
  }

  renderActions = () => {
    const {
      body,
      primaryButtonColor,
      primaryButtonText,
      secondaryButtonColor,
      secondaryButtonText
    } = this.props

    return (
      <ButtonGroup block>
        { !!secondaryButtonText && (
          <Button color={ secondaryButtonColor || Color.Red } onClick={ this.onClickSecondaryButton } >
            { secondaryButtonText }
          </Button>
        ) }
        <Button color={ primaryButtonColor || Color.Green } onClick={ this.onClickPrimaryButton } fill>
          { primaryButtonText || "OK" }
        </Button>
      </ButtonGroup>
    )
  }

  renderContent = () => {
    const { body } = this.props

    return typeof body === "string"
      ? <p className="MessageModal__content">{ body }</p>
      : React.cloneElement(body, {
        className: classnames("MessageModal__content", body.props.className)
      })
  }

  renderHeader = () => {
    const { title } = this.props

    if (!title) return null

    return (
      <div className="MessageModal__header">
        <h2>{ title }</h2>
      </div>
    )
  }

  render () {
    const {
      title, body, primaryButtonText,
      secondaryButtonText, onClickPrimaryButton,
      onClickSecondaryButton, ...rest
    } = this.props

    return (
      <Modal className="MessageModal">

      </Modal>
    )
  }
}

export default MessageModal
