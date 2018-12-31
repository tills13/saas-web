import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import SnakeDetails from "../components/SnakeDetails";

interface ViewSnakeProps {
  snake: Models.Snake
}

export const ViewSnakeQuery = graphql`
  query ViewSnakeQuery ($snakeId: ID!) {
    snake: node (id: $snakeId) {
      ...SnakeDetails_snake
    }
  }
`

function ViewSnake ({ snake }: ViewSnakeProps) {
  return <SnakeDetails snake={ snake } />
}

export default ViewSnake
