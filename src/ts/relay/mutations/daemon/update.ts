import Relay from "react-relay/classic"

interface UpdateDaemonMutationProps {
  daemonId: GraphQL.Schema.GraphQLID
  description: string
  name: string
  url: string
  visibility: string
}

export class UpdateDaemonMutation extends Relay.Mutation<UpdateDaemonMutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { updateDaemonMutation }`
  }

  getVariables() {
    return {
      updateDaemonInput: {
        daemonId: this.props.daemonId,
        description: this.props.description,
        name: this.props.name,
        url: this.props.url,
        visibility: this.props.visibility
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateDaemonMutationPayload {
        daemon
      }
    `
  }

  getConfigs() {
    return [{
      type: "FIELDS_CHANGE",
      fieldIDs: { daemon: this.props.daemonId }
    }]
  }
}
