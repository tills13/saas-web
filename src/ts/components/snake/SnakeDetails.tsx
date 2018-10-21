import "./SnakeDetails.scss"

import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import SnakeAvatar from "components/snake/SnakeAvatar"
import IconLinkButton from "../button/icon_link_button"
import SnakeGameList from "./SnakeGameList"

interface SnakeDetailsProps extends React.AllHTMLAttributes<HTMLDivElement> {
  hideEdit?: boolean
  snake: Models.Snake
}

function SnakeDetails ({ className, hideEdit, snake }: SnakeDetailsProps) {
  const mClassName = classnames("SnakeDetails", className)

  return (
    <div className={ mClassName }>
      <div className="SnakeDetails__header">
        <SnakeAvatar snake={ snake } />
        <div className="SnakeDetails__name">{ snake.name }</div>
        { !hideEdit && <IconLinkButton icon="pencil" to={ `/snakes/${ snake.id }/edit` } /> }
      </div>
      { snake.isBountySnake && (
        <div className="SnakeDetails__bounty">
          <h4 className="SnakeDetails__title">Bounty Description</h4>
          <p>{ snake.bountyDescription }</p>
        </div>
      ) }
      <h4 className="SnakeDetails__title">Recent Games</h4>
      <SnakeGameList snake={ snake } />
    </div>
  )
}

export default createFragmentContainer(
  SnakeDetails,
  graphql`
    fragment SnakeDetails_snake on Snake {
      id, name, isBountySnake, bountyDescription
      ...SnakeAvatar_snake
      ...SnakeGameList_snake
    }
  `
)
