import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { Link } from "react-router"
import { branch, compose, renderComponent } from "recompose"

import Well from "components/well"
import SnakeGamesList from "./game_list"

import createRelayContainer from "components/create_relay_container"

interface SnakeDetailsProps {
  className?: string
  snake: Models.SnakeInterface
}

const SnakeDetails = ({ className, snake }: SnakeDetailsProps) => {
  const mClassName = classnames("SnakeDetails", className)

  return (
    <div className={ mClassName }>
      <div className="SnakeDetails__header">
        <img className="SnakeDetails__head" src={ snake.head.url } />
        <div className="SnakeDetails__name">{ snake.name }</div>
        <Link to={ `snakes/${ snake.id }/edit` }>edit</Link>
      </div>
      { snake.isBountySnake && (
        <div className="SnakeDetails__bounty">
          <h4 className="SnakeDetails__title">Bounty Description</h4>
          <p>{ snake.bountyDescription }</p>
        </div>
      ) }
      <h4 className="SnakeDetails__title">Recent Games</h4>
      <SnakeGamesList snake={ snake } />
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
          head { url }
          isBountySnake
          bountyDescription

          ${SnakeGamesList.getFragment("snake") }
        }
      `
    }
  }),
  branch(
    (props: SnakeDetailsProps) => !props.snake,
    renderComponent(() => <div className="SnakeDetailsEmpty">Select a Snake</div>)
  )
)(SnakeDetails)
