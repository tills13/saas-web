import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { Link } from "react-router"
import { branch, compose, renderComponent } from "recompose"

import IconLinkButton from "components/button/icon_link_button"
import Avatar from "components/snake/avatar"
import Well from "components/well"
import SnakeGamesList from "./game_list"

import createRelayContainer from "components/create_relay_container"
import { renderNothing } from "recompose";

interface SnakeDetailsProps {
  className?: string
  snake: Models.Snake
}

const SnakeDetails = ({ className, snake }: SnakeDetailsProps) => {
  const mClassName = classnames("SnakeDetails", className)

  if (!snake) {
    console.log(snake)
    return null
  }

  return (
    <div className={ mClassName }>
      <div className="SnakeDetails__header">
        <Avatar snake={ snake } />
        <div className="SnakeDetails__name">{ snake.name }</div>
        <IconLinkButton icon="pencil" to={ `snakes/${ snake.id }/edit` } />
      </div>
      { snake.isBountySnake && (
        <div className="SnakeDetails__bounty">
          <h4 className="SnakeDetails__title">Bounty Description</h4>
          <p>{ snake.bountyDescription }</p>
        </div>
      ) }
      <h4 className="SnakeDetails__title">Recent Games</h4>

    </div>
  )
}

export default compose<SnakeDetailsProps, SnakeDetailsProps>(
  createRelayContainer({
    fragments: {
      snake: () => Relay.QL`
        fragment on Snake {
          id
          name
          isBountySnake
          bountyDescription

          ${ Avatar.getFragment("snake") }
          ${ SnakeGamesList.getFragment("snake") }
        }
      `
    }
  })
)(SnakeDetails)
