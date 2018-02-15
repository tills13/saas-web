import "./game_list.scss"

import * as moment from "moment"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { Link } from "react-router"
import { compose } from "recompose"

import GameStatusBadge from "components/game/status_badge"

import createRelayContainer from "components/create_relay_container"

interface SnakeGameListProps {
  snake: Models.Snake
}

const SnakeGameList = ({ snake }: SnakeGameListProps) => {
  console.log(snake)
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
        { snake.games.edges.map(({ node: game }) => {
          return (
            <tr key={ game.id } className="SnakeGameList__row">
              <td className="SnakeGameList__id"><Link to={ `/games/${ game.id }` }>{ game.id }</Link></td>
              <td><GameStatusBadge game={ game } /></td>
              <td>{ game.creator.username }</td>
              <td>{ moment.unix(game.createdAt).format("DD/MM/YYYY") }</td>
            </tr>
          )
        }) }
      </tbody>
    </table>
  )
}

export default compose<SnakeGameListProps, SnakeGameListProps>(
  createRelayContainer({
    fragments: {
      snake: () => Relay.QL`
        fragment on Snake {
          games(first: 10) {
            edges {
              node {
                id
                status
                creator { username }
                createdAt

                ${ GameStatusBadge.getFragment("game") }
              }
            }
          }
        }
      `
    }
  })
)(SnakeGameList)
