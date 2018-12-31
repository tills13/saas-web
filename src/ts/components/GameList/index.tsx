import "./index.scss"

import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import List from "../List"
import GameListItem from "../game/GameListItem"

interface GameListProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  emptyMessage?: string
  games: Models.Game[]
  onClickItem?: (game: Models.Game) => void
}

function GameList ({ className, emptyMessage, games, onClickItem }: GameListProps) {
  const mClassName = classnames("GameList", className)

  return (
    <List<Models.Game>
      className={ mClassName }
      items={ games }
      emptyMessage={ emptyMessage }
      onItemClick={ onClickItem }
      renderItem={ (game, onClick) => (
        <GameListItem
          className={ classnames({ "--withOnClick": !!onClickItem }) }
          key={ game.id }
          game={ game }
          onClick={ onClick }
        />
      ) }
    />
  )
}

export default createFragmentContainer(
  GameList,
  graphql`
    fragment GameList_games on Game @relay(plural: true) {
      id
      ...GameListItem_game
    }
  `
)
