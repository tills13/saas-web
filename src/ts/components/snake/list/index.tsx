import classnames from "classnames"
import React from "react"
import Relay from "react-relay/classic"
import { compose } from "recompose"

import SnakeAvatar from "components/snake/avatar"

import createRelayContainer from "components/create_relay_container"

interface SnakeListInnerProps extends SnakeListOuterProps {

}

interface SnakeListOuterProps {
  className?: string
  onClickSnake?: (snake: Models.Snake) => void
  selectedSnake: Models.Snake
  snakes: Models.Snake[]
}

export class SnakeList extends React.Component<SnakeListInnerProps> {
  renderSnake = (snake: Models.Snake, index?: number) => {
    const { onClickSnake, selectedSnake } = this.props
    const mClassName = classnames("SnakeList__item", {
      "SnakeList__item--selected": selectedSnake && snake.id === selectedSnake.id
    })

    return (
      <div
        key={ snake.id }
        className={ mClassName }
        onClick={ () => onClickSnake(snake) }
      >
        <SnakeAvatar snake={ snake } small />
        <div className="SnakeList__itemInfo">
          <div className="SnakeList__name">{ snake.name }</div>
          <div className="SnakeList__owner">{ snake.owner.username }</div>
        </div>
      </div>
    )
  }

  renderSnakes () {
    const { snakes } = this.props
    return snakes.map(this.renderSnake)
  }

  render () {
    const { className } = this.props
    const mClassName = classnames("SnakeList", className)

    return (
      <div className={ mClassName }>
        { this.renderSnakes() }
      </div>
    )
  }
}

export default compose<SnakeListInnerProps, SnakeListOuterProps>(
  createRelayContainer({
    fragments: {
      snakes: () => Relay.QL`
        fragment on Snake @relay(plural: true) {
          id
          name
          head { url }
          owner { username }

          ${ SnakeAvatar.getFragment("snake") }
        }
      `
    }
  })
)(SnakeList)
