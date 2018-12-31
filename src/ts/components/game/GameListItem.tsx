import "./GameListItem.scss"

import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import Icon from "../Icon"
import SnakeAvatar from "../SnakeAvatar"
import GameStatusBadge from "./GameStatusBadge"

interface GameListItemProps {
  className?: string
  game: GraphQL.GraphNode<Models.Game>
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

function GameListItem ({ className, game, game: { snakes: mSnakes }, onClick }: GameListItemProps) {
  const { count, edges: snakes } = mSnakes
  const mClassName = classnames("GameListItem", className)

  return (
    <div className={ mClassName } onClick={ onClick }>
      <div className="GameListItem__left">
        <div className="GameListItem__snakes">
          { snakes
            .slice(0, 3)
            .map(({ node: snake }) => <SnakeAvatar key={ snake.id } snake={ snake } small />) }
          { count > 3 && <div className="more">+{ count - 3 } more</div> }
        </div>
      </div>
      <div className="GameListItem__right">
        <div className="GameListItem__viewCount">
          <Icon icon="eye" /> { game.viewerCount }
        </div>
        <GameStatusBadge game={ game } />
      </div>
    </div>
  )
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
