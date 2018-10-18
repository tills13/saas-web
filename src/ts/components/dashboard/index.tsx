import "./index.scss"

import classnames from "classnames"
import React from "react"
import { graphql } from "react-relay"

import ErrorBoundary from "../ErrorBoundary"
import Navigation from "../Navigation"

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

  containerRef: React.RefObject<HTMLDivElement>

  constructor (props) {
    super(props)
    this.containerRef = React.createRef()
  }

  onNavItemClick = () => {
    this.containerRef.current.scrollTop = 0
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
        <div ref={ this.containerRef } className={ mClassName } onScroll={ this.onScroll }>
          <Navigation
            compact={ compactNav }
            simple={ simpleNavigation }
            viewer={ viewer }
            onItemClick={ this.onNavItemClick }
          />
          <div className="Dashboard__content">
            { children }
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

export default Dashboard
