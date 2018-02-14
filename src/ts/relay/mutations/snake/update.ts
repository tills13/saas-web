import * as Relay from "react-relay/classic"

interface CreateSnakeMutationProps {
  apiVersion: Models.SnakeInterface["apiVersion"]
  bountyDescription: string
  defaultColor: string
  devUrl: string
  headId: string
  isBountySnake: string
  name: string
  snakeId: GraphQL.Schema.GraphQLID
  url: string
  visibility: string
}

export class UpdateSnakeMutation extends Relay.Mutation<CreateSnakeMutationProps, any> {
  getMutation () {
    return Relay.QL`mutation { updateSnakeMutation }`
  }

  getVariables () {
    return {
      updateSnakeInput: {
        apiVersion: this.props.apiVersion,
        bountyDescription: this.props.bountyDescription,
        defaultColor: this.props.defaultColor,
        devUrl: this.props.devUrl,
        headId: this.props.headId,
        isBountySnake: this.props.isBountySnake,
        name: this.props.name,
        snakeId: this.props.snakeId,
        url: this.props.url,
        visibility: this.props.visibility
      }
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateSnakeMutationPayload {
        snake
      }
    `
  }

  getConfigs () {
    return [{
      type: "FIELDS_CHANGE",
      fieldIDs: {
        snake: this.props.snakeId
      }
    }]
  }
}
