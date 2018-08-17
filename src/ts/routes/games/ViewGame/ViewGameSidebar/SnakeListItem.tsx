import "./SnakeListItem.scss"

import classnames from "classnames"
import { range } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import SnakeAvatar from "components/snake/SnakeAvatar"

interface SnakeListItemProps {
  snake: GameAPI.Snake & Models.Snake
}

function SnakeListItem ({ snake }: SnakeListItemProps) {
  const mClassName = classnames("SnakeListItem", { "--dead": snake.health === 0 })
  console.log(snake)

  const style = {
    width: `${ snake.health || 100 }%`,
    background: snake.color || snake.defaultColor
  }

  return (
    <div className={ mClassName }>
      <div className="SnakeListItem__info">
        <SnakeAvatar snake={ snake } />
        <div className="SnakeListItem__healthContainer">
          <div className="SnakeListItem__health" style={ style } />
          <div className="SnakeListItem__snakeInfo">
            { snake.name } ({ snake.health || 100 })
          </div>
        </div>
      </div>
      { snake.goldCount > 0 && (
        <div className="SnakeListItem__goldContainer">
          { range(0, snake.goldCount).map((index) => <span key={ index } />) }
        </div>
      ) }
      <div className="SnakeListItem__taunt">
        { snake.taunt }
      </div>
      { snake.error && (
        <div className="SnakeListItem__error">
          { snake.error }
        </div>
      ) }
    </div>
  )
}

export default createFragmentContainer(
  SnakeListItem,
  graphql`
    fragment SnakeListItem_snake on Snake {
      name
      ...SnakeAvatar_snake
    }
  `
)
