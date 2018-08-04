import "./SnakeAvatar.scss"

import classnames from "classnames"
import { get } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface SnakeAvatarProps extends React.AllHTMLAttributes<HTMLImageElement> {
  small?: boolean
  snake: Models.Snake
}

function SnakeAvatar ({ small = false, snake }: SnakeAvatarProps) {
  const mClassName = classnames("SnakeAvatar", {
    "SnakeAvatar--small": small
  })

  return <img className={ mClassName } src={ get(snake, "head.url") } title={ snake.name } />
}

export default createFragmentContainer(
  SnakeAvatar,
  graphql`
    fragment SnakeAvatar_snake on Snake {
      name
      head { url }
    }
  `
)
