import "./index.scss"

import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { CSSTransition, TransitionGroup } from "react-transition-group"

import Container from "../Container"
import NavItem from "./NavItem"

import { logout } from "utils/auth"

const transitionClassNames = {
  appear: "Navigation__mobile--appear",
  appearActive: "Navigation__mobile--appearActive",
  enter: "Navigation__mobile--enter",
  enterActive: "Navigation__mobile--enterActive",
  exit: "Navigation__mobile--exit",
  exitActive: "Navigation__mobile--exitActive"
}

interface NavigationProps extends React.AllHTMLAttributes<any> {
  className?: string
  compact?: boolean
  onItemClick?: React.MouseEventHandler<HTMLElement>
  simple?: boolean
  viewer: GraphQL.Schema.Viewer
}

interface NavigationState {
  mobileMenuExpanded: boolean
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  static defaultProps = { simple: false }

  state: NavigationState = { mobileMenuExpanded: false }

  toggleMobileMenu = (_: React.MouseEvent<any>) => {
    this.setState(({ mobileMenuExpanded }) => ({ mobileMenuExpanded: !mobileMenuExpanded }))
  }

  renderLeftNav () {
    return (
      <div className="Navigation__left">
        <NavItem className="NavItem__brand" to="/">SaaS</NavItem>
        <NavItem to="/games" />
        <NavItem to="/snakes" />
        <NavItem to="/documentation" />
        <NavItem overflow={ [ <NavItem to="/daemons" />, <NavItem to="/boards" /> ] }>
          More
        </NavItem>
      </div>
    )
  }

  renderViewerControls () {
    const { viewer } = this.props

    if (!viewer) {
      return (
        <React.Fragment>
          <NavItem to="/login" />
          <NavItem to="/register" />
        </React.Fragment>
      )
    }

    return <NavItem onClick={ _ => logout() }>Logout</NavItem>
  }

  renderRightNav () {
    const { viewer } = this.props
    const { mobileMenuExpanded } = this.state

    return (
      <div className="Navigation__right">
        { this.renderViewerControls() }
        <NavItem
          className="Navigation__toggle"
          icon={ mobileMenuExpanded ? "close" : "menu" }
          onClick={ this.toggleMobileMenu }
        />
      </div>
    )
  }

  render () {
    const { className, compact } = this.props
    const { mobileMenuExpanded } = this.state

    const mClassName = classnames("Navigation", className, {
      "--compact": compact,
      "--expanded": mobileMenuExpanded
    })

    return (
      <div className={ mClassName }>
        <Container className="Navigation__inner">
          { this.renderLeftNav() }
          { this.renderRightNav() }
        </Container>
        <TransitionGroup>
          { mobileMenuExpanded && (
            <CSSTransition classNames={ transitionClassNames } timeout={ 500 }>
              <Container className="Navigation__mobile">
                { this.renderLeftNav() }
                { this.renderRightNav() }
              </Container>
            </CSSTransition>
          ) }
        </TransitionGroup>
      </div>
    )
  }
}

export default createFragmentContainer<NavigationProps>(
  Navigation,
  graphql`
    fragment Navigation_viewer on User {
      id, username
    }
  `
)
