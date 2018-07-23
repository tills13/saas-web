import Relay from "react-relay/classic"

interface CreateSnakeMutationProps {
  apiVersion: Models.Snake["apiVersion"]
  bountyDescription: string
  defaultColor: string
  devUrl: string
  headId: string
  isBountySnake: string
  name: string
  url: string
  visibility: string
}

export class CreateSnakeMutation extends Relay.Mutation<CreateSnakeMutationProps, any> {
  getMutation () {
    return Relay.QL`mutation { createSnakeMutation }`
  }

  getVariables () {
    return {
      createSnakeInput: {
        apiVersion: this.props.apiVersion,
        bountyDescription: this.props.bountyDescription,
        defaultColor: this.props.defaultColor,
        devUrl: this.props.devUrl,
        headId: this.props.headId,
        isBountySnake: this.props.isBountySnake,
        name: this.props.name,
        url: this.props.url,
        visibility: this.props.visibility
      }
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on CreateSnakeMutationPayload {
        snake
      }
    `
  }

  getConfigs () {
    return [{
      type: "REQUIRED_CHILDREN",
      children: [
        Relay.QL`
          fragment on CreateSnakeMutationPayload {
            snake {
              name
            }
          }
        `
      ]
    }]
  }
}
