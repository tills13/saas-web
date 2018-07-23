import "./index.scss"

import classnames from "classnames"
import React from "react"

import Icon from "components/icon"

export interface BaseModalProps {
  className?: string
  close: () => void
  content?: JSX.Element // React.DOMElement<any, any>
  renderContent?: () => JSX.Element // React.DOMElement<any, any>
  renderFooter?: () => JSX.Element // React.DOMElement<any, any>
  renderHeader?: () => JSX.Element // React.DOMElement<any, any>
}

export class BaseModal extends React.Component<BaseModalProps, any> {
  renderContent() {
    const { content, renderContent } = this.props

    if (!(content || renderContent)) {
      throw new Error("must supply one of either `content` or `renderContent` as a prop")
    }

    const mContent = renderContent ? renderContent() : content
    return React.cloneElement(mContent, {
      className: classnames("Modal__content", mContent.props.className)
    })
  }

  renderFooter() {
    const { renderFooter } = this.props

    if (!renderFooter) return null

    const header = renderFooter()
    return header ? React.cloneElement(header, {
      className: classnames("Modal__footer", header.props.className)
    }) : null
  }

  renderHeader() {
    const { renderHeader } = this.props

    if (!renderHeader) return null

    const header = renderHeader()
    return header ? React.cloneElement(header, {
      className: classnames("Modal__header", header.props.className)
    }) : null
  }

  render() {
    const { className, close, renderHeader } = this.props
    const mClassName = classnames("Modal", className, {
      "Modal--noHeader": !renderHeader
    })



    return (
      <div className={ mClassName }>
        <Icon icon="times" className="Modal__close" onClick={ close } />
        { this.renderHeader() }
        { this.renderContent() }
        { this.renderFooter() }
      </div>
    )
  }
}

export default BaseModal
