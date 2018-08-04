import "./GameList.scss"

import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import List from "../list"
import GameListItem from "./GameListItem"

interface GameListProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  games: Models.Game[]
}

function GameList ({ className, games }: GameListProps) {
  const mClassName = classnames("GameList", className)

  return (
    <List className={ mClassName }>
      { games.map((game) => <GameListItem key={ game.id } game={ game } />) }
    </List>
  )
}

export default createFragmentContainer(
  GameList,
  graphql`
    fragment GameList_games on Game @relay(plural: true) {
      ...GameListItem_game
    }
  `
)
