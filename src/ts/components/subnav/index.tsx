import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"

import { compose, defaultProps } from "recompose"

import Container from "components/container"
import NavItem from "./nav_item"

interface SubNavComponentOuterPropsProps {
  className?: string
  leftNav?: NavItem[]
  rightNav?: NavItem[]
}

type SubNavComponentInnerProps = SubNavComponentOuterPropsProps

const SubNav = ({ className, leftNav, rightNav }: SubNavComponentInnerProps) => {
  const mClassName = classnames("SubNav", className)

  return (
    <div className={ mClassName }>
      <Container className="SubNav__inner">
        <div className="SubNav__left">
          { leftNav.map((navItem) => <NavItem key={ navItem.key || navItem.label } navItem={ navItem } />) }
        </div>
        <div className="SubNav__right">
          { rightNav.map((navItem) => <NavItem key={ navItem.key || navItem.label } navItem={ navItem } />) }
        </div>
      </Container>
    </div>
  )
}

export default compose<SubNavComponentInnerProps, SubNavComponentOuterPropsProps>(
  defaultProps({ leftNav: [], rightNav: [] })
)(SubNav)
