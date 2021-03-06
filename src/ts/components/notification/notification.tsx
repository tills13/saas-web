import "./notification.scss"

import classnames from "classnames"
import React from "react"

interface NotificationProps {
  className?: string
  clear?: () => void
  icon?: React.ReactNode
  message: string
  show: boolean
  type: NotificationType
}

enum NotificationType { Error, Success }

class Notification extends React.Component<NotificationProps, any> {
  renderIcon () {
    const { icon } = this.props

    if (!icon) return null

    return (
      <div className="Notification__iconContainer">
        { typeof icon === "string"
          ? <img className="Notification__icon" src={ icon } />
          : icon
        }
      </div>
    )
  }

  renderMessage () {
    const { message } = this.props

    return (
      <div className="Notification__message">
        { message }
      </div>
    )
  }

  render () {
    const { className, clear, type } = this.props

    const mClassName = classnames("Notification", className, {
      "--error": type === NotificationType.Error,
      "--success": type === NotificationType.Success
    })

    return (
      <div className={ mClassName } onClick={ clear }>
        { this.renderIcon() }
        { this.renderMessage() }
      </div>
    )
  }
}

export default Notification
