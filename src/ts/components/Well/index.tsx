import "./index.scss"

import classnames from "classnames"
import React from "react"

function Well ({ children, className }: React.AllHTMLAttributes<HTMLDivElement>) {
  const mClassName = classnames("Well", className)

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Well
