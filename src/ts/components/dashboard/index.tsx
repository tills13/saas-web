import "./index.scss"

import classnames from "classnames"
import React from "react"
import { graphql } from "react-relay"

import RouteContainer from "../container/route_container"
import ErrorBoundary from "../error_boundary"
import Navigation from "../navigation"

interface DashboardProps {
  className?: string
  simpleNavigation: boolean
  viewer: GraphQL.Schema.Viewer
}

interface DashboardState {
  compactNav: boolean
}

const SCROLL_TOP_THRESHOLD = 62

export const DashboardQuery = graphql`
  query DashboardQuery {
    viewer { ...Navigation_viewer }
  }
`

class Dashboard extends React.Component<DashboardProps, DashboardState> {
  static defaultProps = { simpleNavigation: true }

  state: DashboardState = { compactNav: false }

  node: HTMLElement

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
        <div ref={ node => this.node = node } className={ mClassName } onScroll={ this.onScroll }>
          <Navigation
            compact={ compactNav }
            simple={ simpleNavigation }
            viewer={ viewer }
            onItemClick={ (event) => this.node.scrollTop = 0 }
          />
          <div className="Dashboard__content">
            <RouteContainer>{ children }</RouteContainer>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

export default Dashboard
