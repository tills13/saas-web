import "./index.scss"

import classnames from "classnames"
import React from "react"

function Header ({ children, className }: React.AllHTMLAttributes<HTMLDivElement>) {
  const mClassName = classnames("Header", className)

  if (React.Children.count(children) === 0) return null

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Header
