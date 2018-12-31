import React from "react"
import { graphql } from "react-relay"

import LinkButton from "components/LinkButton"
import Header from "components/Header"
import CreateEditSnakeForm from "form/CreateEditSnakeForm"
// import Avatar from "components/snake/SnakeAvatar"
import SnakeDetails from "components/SnakeDetails"

interface EditSnakeProps extends React.AllHTMLAttributes<HTMLDivElement> {
  snake: GraphQL.Schema.Node<Models.Snake>
}

export const EditSnakeQuery = graphql`
  query EditSnakeQuery ($snakeId: ID!) {
    snake: node (id: $snakeId) {
      ...CreateEditSnakeForm_snake
      ...SnakeDetails_snake
      ...on Snake { name }
    }
  }
`

function EditSnake ({ snake }: EditSnakeProps) {
  return (
    <div className="CreateEditSnake">
      <Header>
        <div><h2 className="Header__title">Editing { snake.name }</h2></div>
        <div>
          <LinkButton to="/snakes/create" fill small>Create Snake</LinkButton>
        </div>
      </Header>
      <div className="CreateEditSnake__container">
        <SnakeDetails snake={ snake } showGames={ false } hideEdit />
        <CreateEditSnakeForm snake={ snake } />
      </div>
    </div>
  )
}

export default EditSnake
