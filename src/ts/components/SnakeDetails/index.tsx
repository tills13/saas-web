import "./index.scss"

import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import SnakeAvatar from "components/SnakeAvatar"
import LinkButton from "components/LinkButton"
import GameList from "components/GameList";

interface SnakeDetailsProps extends React.AllHTMLAttributes<HTMLDivElement> {
  hideEdit?: boolean
  showGames?: boolean
  snake: Models.Snake & GraphQL.Alias<"wins", Models.Snake[ "games" ]>
}

function SnakeDetails ({ className, hideEdit, showGames = true, snake }: SnakeDetailsProps) {
  const mClassName = classnames("SnakeDetails", className)
  const snakeGames = snake.games.edges.map(g => g.node)
  const snakeWins = snake.wins.edges.map(g => g.node)

  return (
    <div className={ mClassName }>
      <div className="SnakeDetails__header">
        <SnakeAvatar snake={ snake } />
        <div className="SnakeDetails__name">{ snake.name }</div>
        { !hideEdit && <LinkButton to={ `/snakes/${ snake.id }/edit` }>Edit { snake.name }</LinkButton> }
      </div>

      { snake.isBountySnake && (
        <div className="SnakeDetails__bounty">
          <h4 className="SnakeDetails__title">Bounty Description</h4>
          <p>{ snake.bountyDescription }</p>
        </div>
      ) }

      { showGames && (
        <>
          <h4 className="SnakeDetails__title">Recent Games</h4>
          <GameList games={ snakeGames } />

          <h4 className="SnakeDetails__title">Recent Wins</h4>
          <GameList emptyMessage="No wins..." games={ snakeWins } />
        </>
      ) }

    </div>
  )
}

export default createFragmentContainer(
  SnakeDetails,
  graphql`
    fragment SnakeDetails_snake on Snake {
      id, name, isBountySnake, bountyDescription

      games(first: 10) { edges { node { ...GameList_games } } }
      wins: games(first: 10, placement: 1) { edges { node { ...GameList_games } } }

      ...SnakeAvatar_snake
    }
  `
)
