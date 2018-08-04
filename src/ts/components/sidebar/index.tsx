import * as classnames from "classnames"
import * as React from "react"

import Icon from "../icon"

interface SidebarProps {
  className?: string
  collapsed?: boolean
}

interface SidebarState {
  collapsed: boolean
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor (props) {
    super(props)

    this.state = {
      collapsed: !!props.collapsed
    }
  }

  toggleCollapsed = () => this.setState(({ collapsed }) => ({ collapsed: !collapsed }))

  render () {
    const { className } = this.props
    const { collapsed } = this.state

    const mClassName = classnames("Sidebar", className, { "--collapsed": collapsed })

    return (
      <div className={ mClassName }>
        <div className="Sidebar__header">
          <h3>{ }</h3>
          <Icon
            icon={ `chevron-${ collapsed ? "right" : "left" }` }
            onClick={ this.toggleCollapsed }
          />
        </div>
      </div>
    )
  }
}

export default Sidebar
