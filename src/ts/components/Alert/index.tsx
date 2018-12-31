import "./index.scss"

import classnames from "classnames"
import React from "react"

type AlertType = "danger" | "info" | "success" | "warning"

interface AlertProps extends React.AllHTMLAttributes<HTMLDivElement> {
  alertType: AlertType
  className?: string
  inline?: boolean
}

function Alert ({ alertType, children, className, inline }: AlertProps) {
  const mClassName = classnames("Alert", className, `--${ alertType }`, {
    "--inline": inline
  })

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Alert
