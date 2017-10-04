import "./list_item.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { Link } from "react-router"
import { compose } from "recompose"

import GameStatusBadge from "components/game/status_badge"
import Icon from "components/icon"
import SnakeAvatar from "components/snake/avatar"

import createRelayContainer from "components/create_relay_container"

interface GameListItemProps {
  className?: string
  game: Models.GameInterface
}

class GameListItem extends React.Component<GameListItemProps> {
  renderSnakes() {
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

  render() {
    const { className, game } = this.props
    const mClassName = classnames("GameListItem", className)

    return (
      <Link className={ mClassName } to={ `/games/${ game.id }` }>
        <div className="GameListItem__left">
          <strong>{ game.id.substring(0, 20) }</strong>
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

export default compose<GameListItemProps, GameListItemProps>(
  createRelayContainer({
    fragments: {
      game: () => Relay.QL`
        fragment on Game {
          id
          creator { username }
          viewerCount
          snakes(first: 10) {
            count
            edges {
              node {
                id
                ${ SnakeAvatar.getFragment("snake") }
              }
            }
          }
          ${ GameStatusBadge.getFragment("game") }
        }
      `
    }
  })
)(GameListItem)
