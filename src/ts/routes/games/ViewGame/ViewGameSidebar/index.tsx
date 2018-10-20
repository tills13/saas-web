import "./index.scss"

import classnames from "classnames"
import { map, merge } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import Alert, { AlertType } from "components/Alert"
import LinkButton from "components/button/link_button"
import Icon from "components/icon"
import Well from "components/Well"
import SnakeListItem from "./SnakeListItem"

import { getIdFromGlobalId } from "utils/relay"

interface ViewGameSidebarProps extends GameAPI.GameState {
  className?: string
  game: Models.Game
}

function ViewGameSidebar ({ className, board, daemon, errors, game, turnNumber, viewers }: ViewGameSidebarProps) {
  const mClassName = classnames("ViewGameSidebar", className)

  const bSnakes = board ? board.snakes.sort((a, b) => a.score - b.score) : []
  const gSnakes = game.snakes.edges.map(({ node: snake }) => snake)

  const mSnakes = gSnakes.map(gSnake => {
    const bSnake = bSnakes.find(s => getIdFromGlobalId(gSnake.id) === s.id)
    return merge(bSnake, gSnake)
  })

  return (
    <div className={ mClassName }>
      <div className="ViewGameSidebar__header">
        <div className="ViewGameSidebar__viewerCount">
          <Icon icon="account-multiple" /> { viewers || 0 } { viewers !== 1 ? "people" : "person" }
        </div>
        <div className="ViewGameSidebar__turnNumber">
          Turn { turnNumber || 0 }{ game.turnLimit != null && `/${ game.turnLimit }` }
        </div>
      </div>

      { game.daemon && (
        <Well className="ViewGameSidebar__daemon">
          <h4 className="Daemon__name">{ game.daemon.name }</h4>
          { daemon && <p className="Daemon__message">{ daemon.message }</p> }
        </Well>
      ) }

      { errors && map(errors, error => <Alert alertType={ AlertType.Danger }>{ error }</Alert>) }

      <div className="ViewGameSidebar__snakes">
        { mSnakes.map((snake) => <SnakeListItem key={ snake.id } snake={ snake } />) }
      </div>

      <LinkButton to={ `/games/${ game.id }/edit` } block>Edit Game</LinkButton>
    </div>
  )
}

export default createFragmentContainer(
  ViewGameSidebar,
  graphql`
    fragment ViewGameSidebar_game on Game {
      id
      turnLimit

      daemon { id, name }
      snakes (first: 12) {
        edges {
          node { id, ...SnakeListItem_snake }
        }
      }
    }
  `
)
