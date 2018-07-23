import "./index.scss"

import classnames from "classnames"
import React from "react"

interface AlertProps extends React.Props<any> {
  className?: string
  inline?: boolean
  type: string
}

class Alert extends React.Component<AlertProps, any> {
  static TYPE_SUCCESS = "success"
  static TYPE_WARNING = "warning"
  static TYPE_DANGER = "danger"
  static TYPE_INFO = "info"

  render () {
    const { children, className, inline, type } = this.props
    const mClassName = classnames("Alert", `Alert--${ type }`, className, {
      "Alert--inline": inline
    })

    return (
      <div className={ mClassName }>
        { children }
      </div>
    )
  }
}

export default Alert
