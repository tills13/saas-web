import "./index.scss"

import classnames from "classnames"
import React from "react"
import Relay from "react-relay/classic"
import { compose } from "recompose"

import Icon from "components/icon"
import Well from "components/well"
import SnakeListItem from "./snake_list_item"

import createRelayContainer from "components/create_relay_container"

interface ViewGameSidebarInnerProps extends ViewGameSidebarOuterProps {

}

interface ViewGameSidebarOuterProps {
  className?: string
  daemon: GameAPI.Daemon
  game: Models.Game
  snakes: GameAPI.Snake[]
  turnLimit: number
  turnNumber: number
  viewerCount: number
}

class ViewGameSidebar extends React.Component<ViewGameSidebarInnerProps, any> {
  renderSnakes () {
    const { snakes } = this.props

    return (
      <div className="ViewGameSidebar__snakes">
        { snakes.sort((a, b) => a.score - b.score).map((snake) => {
          return <SnakeListItem key={ snake.id } snake={ snake } />
        }) }
      </div>
    )
  }

  render () {
    const { className, daemon, game, turnLimit, turnNumber, viewerCount } = this.props
    const mClassName = classnames("ViewGameSidebar", className)

    return (
      <div className={ mClassName }>
        <div className="ViewGameSidebar__header">
          <div className="ViewGameSidebar__viewerCount">
            <Icon icon="account-multiple" /> { viewerCount || 0 } { viewerCount !== 1 ? "people" : "person" }
          </div>
          <div className="ViewGameSidebar__turnNumber">
            Turn { turnNumber || 0 }{ turnLimit != null && `/${ turnLimit }` }
          </div>
        </div>

        { game.daemon && (
          <Well className="ViewGameSidebar__daemon">
            <h4 className="Daemon__name">{ game.daemon.name }</h4>
            { daemon && <p className="Daemon__message">{ daemon.message }</p> }
          </Well>
        ) }

        { this.renderSnakes() }
      </div>
    )
  }
}

export default compose<ViewGameSidebarInnerProps, ViewGameSidebarOuterProps>(
  createRelayContainer({
    fragments: {
      game: () => Relay.QL`
        fragment on Game {
          daemon {
            id
            name
          }
        }
      `
    }
  })
)(ViewGameSidebar)
