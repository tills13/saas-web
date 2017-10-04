import * as Relay from "react-relay/classic"

interface PublishFileMutationProps {
  fileId: string
}

export class PublishFileMutation extends Relay.Mutation<PublishFileMutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { publishFileMutation }`
  }

  getVariables() {
    return {
      publishFileMutationInput: {
        fileId: this.props.fileId
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on PublishFileMutationPayload {
        publishedFile
      }
    `
  }

  getConfigs() {
    return [{
      type: "FIELDS_CHANGE",
      fieldIDs: {
        publishedFile: this.props.fileId
      }
    }]
  }
}
