import "./manager.scss"

import { CLEAR_NOTIFICATION } from "actions"
import React from "react"
import { connect } from "react-redux"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { compose } from "recompose"
import { store } from "../../store"

// console.log(t)

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
  renderNotification() {
    const { notifications } = this.props

    return notifications.reverse().map((notification, index) => {
      const clearNotification = () => {
        store.dispatch({
          type: CLEAR_NOTIFICATION,
          notificationId: notification.id
        })
      }

      return (
        <CSSTransition
          key={ index }
          classNames={ transitionClassNames }
          timeout={ 500 }
        >
          <Notification
            {...notification}
            clear={ clearNotification }
          />
        </CSSTransition>
      )
    })
  }

  render() {
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

export default connect<any, any, any>((state) => {
  return { notifications: state.notification.get("notifications") }
})(NotificationManager)
