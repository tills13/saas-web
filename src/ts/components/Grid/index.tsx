import "./index.scss"

import classnames from "classnames"
import React from "react"

function Grid ({ children, className }: React.AllHTMLAttributes<HTMLDivElement>) {
  const mClassName = classnames("Grid", className)

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Grid
