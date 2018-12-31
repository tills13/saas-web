import "./index.scss"

import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import Icon from "components/Icon"
import SnakeAvatar from "components/SnakeAvatar"
import IconButton from "components/IconButton";
import ButtonGroup from "components/ButtonGroup";

interface SnakeListItemProps extends React.AllHTMLAttributes<HTMLDivElement> {
  snake: Models.Snake
}

function SnakeListItem ({ snake, onClick }: SnakeListItemProps) {
  return (
    <div className="SnakeListItem" onClick={ onClick }>
      <div className="SnakeListItem__info">
        <SnakeAvatar snake={ snake } small />
        <div className="SnakeListItem__name">{ snake.name }</div>
        <div className="SnakeListItem__owner">{ snake.owner.username }</div>
      </div>
      <div className="SnakeListItem__extra">
        <ButtonGroup className="SnakeListItem__actions">
          <IconButton icon="edit" />
          <IconButton icon="delete" />
          <IconButton icon="arrow_right" />
        </ButtonGroup>
        <Icon icon={ snake.visibility === "PUBLIC" ? "lock_open" : "lock" } />
      </div>
    </div>
  )
}

export default createFragmentContainer(
  SnakeListItem,
  graphql`
    fragment SnakeListItem_snake on Snake {
      name, visibility, owner { username }, ...SnakeAvatar_snake
    }
  `
)
