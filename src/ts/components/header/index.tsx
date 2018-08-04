import "./index.scss"

import classnames from "classnames"
import React from "react"

interface HeaderProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
}

function Header ({ children, className }: HeaderProps) {
  const mClassName = classnames("Header", className)

  if (React.Children.count(children) === 0) return null

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Header
