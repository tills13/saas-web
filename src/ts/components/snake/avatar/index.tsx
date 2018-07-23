import "./index.scss"

import classnames from "classnames"
import React from "react"
import Relay from "react-relay/classic"

import createRelayContainer from "components/create_relay_container"

interface SnakeAvatarProps {
  small?: boolean
  snake: Models.Snake
}

const SnakeAvatar = ({ small = false, snake }: SnakeAvatarProps) => {
  const mClassName = classnames("SnakeAvatar", {
    "SnakeAvatar--small": small
  })

  return <img className={ mClassName } src={ snake.head.url } title={ snake.name } />
}

export default createRelayContainer({
  fragments: {
    snake: () => Relay.QL`
      fragment on Snake {
        name
        head { url }
      }
    `
  }
})(SnakeAvatar)

