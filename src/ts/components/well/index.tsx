import "./index.scss"

import classnames from "classnames"
import React from "react"

interface WellProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
}

export default function Well ({ children, className }: WellProps) {
  const mClassName = classnames("Well", className)

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}
