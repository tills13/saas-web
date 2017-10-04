import * as Relay from "react-relay/classic"

interface DeleteSnakeMutationProps {
  snakeId: GraphQL.Schema.GraphQLID
}

export class DeleteSnakeMutation extends Relay.Mutation<DeleteSnakeMutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { deleteSnakeMutation }`
  }

  getVariables() {
    return {
      deleteSnakeInput: {
        snakeId: this.props.snakeId
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteSnakeMutationPayload {
        application { snakes { items } }
        snake
      }
    `
  }

  getConfigs() {
    return []
  }
}
