import "./nav_item.scss"

import classnames from "classnames"
import { Link } from "found"
import React from "react"


import Icon from "components/icon"

interface NavItemProps extends React.Props<any> {
  className?: string
  icon?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  to?: string
}

const NavItem = ({ children, className, icon, onClick, to }: NavItemProps) => {
  const mClassName = classnames("NavItem", className)

  if (!(to || onClick)) throw new Error("must provider either `to` or `onClick` to NavItem")

  return (
    <Link to={ to } className={ mClassName } onClick={ onClick }>
      { icon && <Icon icon={ icon } /> }
      { children }
    </Link>
  )
}

export default NavItem
