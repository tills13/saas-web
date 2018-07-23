import "./index.scss"

import classnames from "classnames"
import React from "react"

import ButtonGroup from "components/button/button_group"
import Button from "components/form/button"
import { BaseModal, BaseModalProps } from "../base"

export interface MessageModalProps {
  body: string | JSX.Element
  onClickPrimaryButton?: () => void
  onClickSecondaryButton?: () => void
  primaryButtonColor?: string
  primaryButtonText?: string
  secondaryButtonColor?: string
  secondaryButtonText?: string
  title?: string | JSX.Element
}

export class MessageModal extends React.Component<MessageModalProps & BaseModalProps, any> {
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
      body, primaryButtonColor, primaryButtonText,
      secondaryButtonColor, secondaryButtonText
    } = this.props

    return (
      <ButtonGroup block>
        { !!secondaryButtonText && (
          <Button color={ secondaryButtonColor || Button.COLOR_RED } onClick={ this.onClickSecondaryButton } >
            { secondaryButtonText }
          </Button>
        ) }
        <Button color={ primaryButtonColor || Button.COLOR_GREEN } onClick={ this.onClickPrimaryButton } fill>
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

  render() {
    const {
      title, body, primaryButtonText,
      secondaryButtonText, onClickPrimaryButton,
      onClickSecondaryButton, ...rest
    } = this.props

    return (
      <BaseModal
        className="MessageModal"
        renderContent={ this.renderContent }
        renderFooter={ this.renderActions }
        renderHeader={ this.renderHeader }
        { ...rest }
      />
    )
  }
}
