import "./SnakeGameList.scss"

import { Link } from "found"
import { DateTime } from "luxon"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import GameStatusBadge from "../game/GameStatusBadge"

interface SnakeGameListProps {
  snake: Models.Snake
}

function SnakeGameList ({ snake }: SnakeGameListProps) {
  return (
    <table className="SnakeGameList">
      <thead>
        <tr>
          <th>id</th>
          <th>status</th>
          <th>creator</th>
          <th>created at</th>
        </tr>
      </thead>
      <tbody>
        { snake.games.count === 0 && <div>No games...</div> }
        { snake.games.edges.map(({ node: game }) => {
          return (
            <tr key={ game.id } className="SnakeGameList__row">
              <td className="SnakeGameList__id"><Link to={ `/games/${ game.id }` }>{ game.id }</Link></td>
              <td><GameStatusBadge game={ game } /></td>
              <td>{ game.creator.username }</td>
              <td>{ DateTime.fromMillis(game.createdAt * 1000).toFormat("DD/MM/YYYY") }</td>
            </tr>
          )
        }) }
      </tbody>
    </table>
  )
}

export default createFragmentContainer(
  SnakeGameList,
  graphql`
    fragment SnakeGameList_snake on Snake {
      games(first: 10) {
        count
        edges {
          node {
            id, status, createdAt
            creator { username }

            ...GameStatusBadge_game
          }
        }
      }
    }
  `
)
