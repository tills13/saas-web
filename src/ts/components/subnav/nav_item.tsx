import "./nav_item.scss"

import * as classnames from "classnames"
import * as React from "react"

import { Link } from "react-router"

interface NavItem {
  className?: string
  key?: string
  label: string
  to: string
}

interface NavItemProps extends React.Props<any> {
  className?: string
  navItem: NavItem
}

const NavItem = ({ className, navItem }: NavItemProps) => {
  const mClassName = classnames("SubNavItem", className)

  return (
    <Link
      to={ navItem.to }
      className={ mClassName }
      activeClassName="SubNavItem--active"
    >
      { navItem.label }
    </Link>
  )
}

export default NavItem
