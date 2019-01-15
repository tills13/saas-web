import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import SnakeListItem from "components/SnakeListItem"
import List from "components/List"

interface SnakeListProps {
  className?: string
  onClickSnake?: (snake: Models.Snake) => void
  snakes: Models.Snake[]
}

function SnakeList ({ className, onClickSnake, snakes }: SnakeListProps) {
  const mClassName = classnames("SnakeList", className)

  return (
    <div className={ mClassName }>
      <List<Models.Snake>
        items={ snakes }
        emptyMessage="No snakes..."
        onItemClick={ onClickSnake }
        renderItem={ (snake, onClick) => (
          <SnakeListItem
            key={ snake.id }
            onClick={ onClick }
            snake={ snake }
          />
        ) }
      />
    </div>
  )
}

export default createFragmentContainer(
  SnakeList,
  graphql`
    fragment SnakeList_snakes on Snake @relay(plural: true) {
      id

      ...SnakeListItem_snake
    }
  `
)
