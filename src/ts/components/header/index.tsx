import "./index.scss"

import classnames from "classnames"
import React from "react"

interface HeaderProps extends React.Props<any> {
  className?: string
}

export class Header extends React.Component<HeaderProps> {


  render () {
    const { children, className } = this.props
    const mClassName = classnames("Header", className)

    if (React.Children.count(children) === 0) return null

    return (
      <div className={ mClassName }>
        { children }
      </div>
    )
  }
}

export default Header
