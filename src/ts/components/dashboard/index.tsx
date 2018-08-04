import "./index.scss"

import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import Relay, { createFragmentContainer, graphql } from "react-relay"

import ErrorBoundary from "../error_boundary"
import Navigation from "../navigation"

interface DashboardComponentProps {
  className?: string
  relay: Relay.RelayProp
  simpleNavigation: boolean
  viewer: GraphQL.Schema.Viewer
}

const SCROLL_TOP_THRESHOLD = 62

class Dashboard extends React.Component<DashboardComponentProps, { compactNav: boolean }> {
  static childContextTypes = {
    onLogin: PropTypes.func,
    onLogout: PropTypes.func
  }

  static defaultProps = { simpleNavigation: true }

  state = { compactNav: false }

  node: HTMLElement

  getChildContext () {
    const { relay } = this.props

    const onLogin = () => location.href = "/"
    return { onLogin, onLogout: onLogin }
  }

  onScroll = (event: React.UIEvent<HTMLElement>) => {
    const { compactNav } = this.state
    const scrollTop = event.currentTarget.scrollTop

    if (compactNav && (scrollTop < SCROLL_TOP_THRESHOLD)) {
      this.setState({ compactNav: false })
    } else if (!compactNav && (scrollTop > SCROLL_TOP_THRESHOLD)) {
      this.setState({ compactNav: true })
    }
  }

  render () {
    const { children, className, simpleNavigation, viewer } = this.props
    const { compactNav } = this.state
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
        </div>
      </ErrorBoundary>
    )
  }
}

export default createFragmentContainer<DashboardComponentProps>(
  Dashboard,
  graphql`
    fragment Dashboard_viewer on User {
      ...navigation_viewer
    }
  `
)
