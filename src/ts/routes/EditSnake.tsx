import React from "react"
import { graphql } from "react-relay"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import CreateEditSnakeForm from "components/snake/form/CreateEditSnakeForm"
import Avatar from "components/snake/SnakeAvatar"
import SnakeDetails from "components/snake/SnakeDetails"

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
          <LinkButton to="snakes/create" fill small>Create Snake</LinkButton>
        </div>
      </Header>
      <div className="CreateEditSnake__container">
        <SnakeDetails snake={ snake } hideEdit />
        <CreateEditSnakeForm snake={ snake } />
      </div>
    </div>
  )
}

export default EditSnake
