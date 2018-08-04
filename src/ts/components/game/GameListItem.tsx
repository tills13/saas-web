import "./GameListItem.scss"

import classnames from "classnames"
import { Link } from "found"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import Icon from "../icon"
import SnakeAvatar from "../snake/SnakeAvatar"
import GameStatusBadge from "./GameStatusBadge"

import { getIdFromGlobalId } from "utils/relay"

interface GameListItemProps {
  className?: string
  game: Models.Game
}

class GameListItem extends React.Component<GameListItemProps> {
  renderSnakes () {
    const { game: { snakes: mSnakes } } = this.props
    const { count, edges: snakes } = mSnakes

    return (
      <div className="GameListItem__snakes">
        { snakes.slice(0, 3).map(({ node: snake }) => {
          return <SnakeAvatar key={ snake.id } snake={ snake } small />
        }) }
        { count > 3 && <div className="more">+{ count - 3 } more</div> }
      </div>
    )
  }

  render () {
    const { className, game } = this.props
    const mClassName = classnames("GameListItem", className)

    return (
      <Link className={ mClassName } to={ `/games/${ game.id }` }>
        <div className="GameListItem__left">
          <strong>{ getIdFromGlobalId(game.id) }</strong>
          <span className="GameListItem__creator">{ game.creator.username }</span>
        </div>
        <div className="GameListItem__right">
          { this.renderSnakes() }
          <div className="GameListItem__viewCount">
            <Icon icon="eye" /> { game.viewerCount }
          </div>
          <GameStatusBadge game={ game } />
        </div>
      </Link>
    )
  }
}

export default createFragmentContainer(
  GameListItem,
  graphql`
    fragment GameListItem_game on Game {
      id
      creator { username }
      viewerCount

      ...GameStatusBadge_game

      snakes (first: 10) {
        count
        edges {
          node { id, ...SnakeAvatar_snake }
        }
      }
    }
  `
)
