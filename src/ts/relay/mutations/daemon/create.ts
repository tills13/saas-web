import * as Relay from "react-relay/classic"

interface CreateDaemonMutationProps {
  description: string
  name: string
  url: string
  visibility: string
}

export class CreateDaemonMutation extends Relay.Mutation<CreateDaemonMutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { createDaemonMutation }`
  }

  getVariables() {
    return {
      createDaemonInput: {
        description: this.props.description,
        name: this.props.name,
        url: this.props.url,
        visibility: this.props.visibility
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateDaemonMutationPayload {
        daemon
      }
    `
  }

  getConfigs() {
    return [{
      type: "REQUIRED_CHILDREN",
      children: [
        Relay.QL`
          fragment on CreateDaemonMutationPayload {
            daemon { name }
          }
        `
      ]
    }]
  }
}
