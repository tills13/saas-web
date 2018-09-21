import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import SnakeAvatar from "./SnakeAvatar"

interface SnakeListProps {
  className?: string
  onClickSnake?: (snake: Models.Snake) => void
  selectedSnake: Models.Snake
  snakes: Models.Snake[]
}

class SnakeList extends React.Component<SnakeListProps> {
  static defaultProps = { snakes: [] }

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

export default createFragmentContainer(
  SnakeList,
  graphql`
    fragment SnakeList_snakes on Snake @relay(plural: true) {
      id
      name
      head { url }
      owner { username }

      ...SnakeAvatar_snake
    }
  `
)
