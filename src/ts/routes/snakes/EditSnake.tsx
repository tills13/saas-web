import "./EditSnake.scss"

import React from "react"
import { graphql } from "react-relay"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import CreateEditSnakeForm from "components/snake/form/CreateEditSnakeForm"
import Avatar from "components/snake/SnakeAvatar"

interface EditSnakeInnerProps extends EditSnakeOuterProps { }
interface EditSnakeOuterProps extends React.Props<any> {
  snake: GraphQL.Schema.Node<Models.Snake>
}

export const EditSnakeQuery = graphql`
  query EditSnakeQuery ($snakeId: ID!) {
    snake: node (id: $snakeId) {
      ...CreateEditSnakeForm_snake
      ...on Snake {
        name

        games (first: 10) {
          edges {
            node { id }
          }
        }

        ...SnakeAvatar_snake
      }
    }
  }
`

export function EditSnake ({ snake }: EditSnakeInnerProps) {
  return (
    <div className="CreateEditSnake">
      <Header>
        <div><h2 className="Header__title">Editing { snake.name }</h2></div>
        <div>
          <LinkButton to="snakes/create" fill small>Create Snake</LinkButton>
        </div>
      </Header>
      <div className="CreateEditSnake__container">
        <div className="">
          <div className="">
            <Avatar snake={ snake } /> { snake.name }
          </div>
          <div className="">
            <h3>Recent Games</h3>
            <div className="">
              { snake.games.edges.map(({ node: game, place }) => {
                return <div className="">{ game.id } { place }</div>
              }) }
            </div>
          </div>
        </div>
        <CreateEditSnakeForm snake={ snake } />
      </div>
    </div>
  )
}

export default EditSnake
