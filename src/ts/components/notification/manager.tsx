import "./manager.scss"

import React from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import Notification from "./notification"

interface NotificationManagerProps {
  notifications: any[]
}

const transitionClassNames = {
  appear: "NotificationTransition--appear",
  appearActive: "NotificationTransition--appearActive",
  enter: "NotificationTransition--enter",
  enterActive: "NotificationTransition--enterActive",
  exit: "NotificationTransition--exit",
  exitActive: "NotificationTransition--exitActive"
}

class NotificationManager extends React.Component<NotificationManagerProps> {
  renderNotification () {
    const { notifications } = this.props

    return notifications.reverse().map((notification, index) => {
      const clearNotification = () => {
        // store.dispatch({
        //   type: CLEAR_NOTIFICATION,
        //   notificationId: notification.id
        // })
      }

      return (
        <CSSTransition
          key={ index }
          classNames={ transitionClassNames }
          timeout={ 500 }
        >
          <Notification
            { ...notification }
            clear={ clearNotification }
          />
        </CSSTransition>
      )
    })
  }

  render () {
    const { notifications } = this.props

    return (
      <div className="NotificationManager">
        <TransitionGroup className="Notifications">
          { this.renderNotification() }
        </TransitionGroup>
      </div>
    )
  }
}

export default NotificationManager
