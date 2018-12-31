import "./NavItem.scss"

import classnames from "classnames"
import { Link } from "found"
import { capitalize } from "lodash"
import React from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import Icon from "../Icon"

interface NavItemProps {
  className?: string
  icon?: string
  onClick?: React.MouseEventHandler<HTMLElement>
  overflow?: React.ReactNode[]
  to?: string
}

interface NatItemState {
  overflowShown: boolean
}

const transitionClassNames = {
  appear: "NavItem__overflow--appear",
  appearActive: "NavItem__overflow--appearActive",
  enter: "NavItem__overflow--enter",
  enterActive: "NavItem__overflow--enterActive",
  exit: "NavItem__overflow--exit",
  exitActive: "NavItem__overflow--exitActive"
}

class NavItem extends React.Component<NavItemProps, NatItemState> {
  state = { overflowShown: false }

  constructor (props: NavItemProps) {
    super(props)

    if (props.overflow && props.overflow.length === 0 && !(props.to !== "" || props.onClick)) {
      throw new Error("must provider either `to` or `onClick` to NavItem")
    }
  }

  toggleOverflow = () => {
    this.setState(({ overflowShown }) => ({ overflowShown: !overflowShown }))
  }

  renderOverflow () {
    const { overflow } = this.props
    const { overflowShown } = this.state

    return (
      <TransitionGroup>
        { overflowShown && (
          <CSSTransition classNames={ transitionClassNames } timeout={ 500 }>
            <div className="NavItem__overflow">
              { overflow }
            </div>
          </CSSTransition>
        ) }
      </TransitionGroup>
    )
  }

  render () {
    const { children, className, icon, onClick, overflow, to } = this.props
    const { overflowShown } = this.state

    const mClassName = classnames("NavItem", className, { "--withOverflow": overflow && overflow.length > 0 })

    if (overflow && overflow.length >= 1) {
      return (
        <div className={ mClassName } onClick={ this.toggleOverflow }>
          <div className="NavItem__container">
            { icon && <Icon icon={ icon } /> }
            { children }
            <Icon icon={ overflowShown ? "expand_less" : "expand_more" } />
          </div>
          { this.renderOverflow() }
        </div>
      )
    }

    if (!to) {
      return (
        <div className={ mClassName } onClick={ onClick }>
          { icon && <Icon icon={ icon } /> }
          { children }
        </div>
      )
    }

    const mContent = React.Children.count(children) >= 1 ? children : capitalize(to.substring(1))

    return (
      <Link to={ to || "" } className={ mClassName } onClick={ onClick }>
        { icon && <Icon icon={ icon } /> }
        { mContent }
      </Link>
    )
  }
}

export default NavItem
