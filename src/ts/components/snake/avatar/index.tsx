import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"

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

