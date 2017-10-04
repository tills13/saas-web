import "./nav_item.scss"

import * as classnames from "classnames"
import * as React from "react"

import { Link } from "react-router"

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
