import "./index.scss"

import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import { compose, defaultProps } from "recompose"

import ErrorBoundary from "components/error_boundary"
import { ModalManager } from "components/modal/manager"
import Navigation from "components/navigation"
import NotificationManager from "components/notification/manager"

// import createRelayContainer from "components/create_relay_container"
import { createFragmentContainer } from "react-relay"
import { SetStateCallback, withState } from "recompose"

interface DashboardComponentInnerProps extends DashboardComponentOuterProps {
  className?: string
  relay: Relay.RelayProp
  setCompactNav: SetStateCallback<boolean>
  simpleNavigation: boolean
  compactNav: boolean
  viewer: GraphQL.Schema.Viewer
}

interface DashboardComponentOuterProps extends React.Props<any> {
  simpleNavigation?: boolean
}

const SCROLL_TOP_THRESHOLD = 62

class Dashboard extends React.Component<DashboardComponentInnerProps, {}> {
  static childContextTypes = {
    onLogin: PropTypes.func,
    onLogout: PropTypes.func
  }

  static defaultProps = { simpleNavigation: true }

  node: HTMLElement

  getChildContext () {
    const { relay } = this.props

    const onLogin = () => location.href = "/"
    return { onLogin, onLogout: onLogin }
  }

  onScroll = (event: React.UIEvent<HTMLElement>) => {
    const { compactNav, setCompactNav } = this.props
    const scrollTop = event.currentTarget.scrollTop

    if (compactNav && (scrollTop < SCROLL_TOP_THRESHOLD)) {
      setCompactNav(false)
    } else if (!compactNav && (scrollTop > SCROLL_TOP_THRESHOLD)) {
      setCompactNav(true)
    }
  }

  render () {
    const { children, className, compactNav, simpleNavigation, viewer } = this.props
    const mClassName = classnames("Dashboard", className)

    return (
      <ErrorBoundary>
        <div ref={ (node) => this.node = node } className={ mClassName } onScroll={ this.onScroll }>
          <Navigation
            compact={ compactNav }
            simple={ simpleNavigation }
            viewer={ viewer }
            onItemClick={ (event) => this.node.scrollTop = 0 }
          />
          <div className="Dashboard__content">
            { children }
          </div>
          <NotificationManager />
          <ModalManager />
        </div>
      </ErrorBoundary>
    )
  }
}

export default createFragmentContainer(
  withState("compactNav", "setCompactNav", false)(Dashboard),
  graphql`
    fragment dashboard_viewer on User {
      ...navigation_viewer
    }
  `
)
