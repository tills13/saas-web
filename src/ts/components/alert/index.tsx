import "./index.scss"

import classnames from "classnames"
import React from "react"

export enum AlertType { Danger, Info, Success, Warning }

interface AlertProps extends React.AllHTMLAttributes<HTMLDivElement> {
  alertType: AlertType
  className?: string
  inline?: boolean
}

function getAlertTypeName (alertType: AlertType) {
  switch (alertType) {
    case AlertType.Danger: return "danger"
    case AlertType.Success: return "success"
    case AlertType.Warning: return "warning"
    case AlertType.Info:
    default: return "info"
  }
}

function Alert ({ alertType, children, className, inline }: AlertProps) {
  const type = getAlertTypeName(alertType)
  const mClassName = classnames("Alert", className, `--${ type }`, {
    "--inline": inline
  })

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Alert
