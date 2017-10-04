import "./snake_list_item.scss"

import * as classnames from "classnames"
import * as React from "react"

import { Range } from "immutable"

interface SnakeListItemProps {
  snake: GameAPI.Snake
}

const SnakeListItem = ({ snake }: SnakeListItemProps) => {
  const mClassName = classnames("SnakeListItem", {
    "SnakeListItem--dead": snake.health === 0
  })

  const style = {
    width: `${ snake.health || 100 }%`,
    background: snake.color || snake.defaultColor
  }

  return (
    <div className={ mClassName }>
      <div className="SnakeListItem__info">
        <img src={ snake.head ? snake.head.url : null } />
        <div className="SnakeListItem__healthContainer">
          <div className="SnakeListItem__health" style={ style } />
          <div className="SnakeListItem__snakeInfo">{ snake.name } ({ snake.health || 100 })</div>
        </div>
      </div>
      { snake.goldCount > 0 && (
        <div className="SnakeListItem__goldContainer">
          {
            Range(0, snake.goldCount).map((index) => {
              return <span className="SnakeListItem__gold" key={ index } />
            })
          }
        </div>
      ) }
      <div className="SnakeListItem__taunt">
        { snake.taunt }
      </div>
    </div>
  )
}

export default SnakeListItem
