import * as Relay from "react-relay/classic"

interface InitializeFileMutationProps {
  contentType: string
  fileName: string
  uploadType?: string
}

export class InitializeFileMutation extends Relay.Mutation<InitializeFileMutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { initializeFileMutation }`
  }

  getVariables() {
    return {
      initializeFileMutationInput: {
        contentType: this.props.contentType,
        fileName: this.props.fileName,
        uploadType: this.props.uploadType
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on InitializeFileMutationPayload {
        file
        uploadUrl
      }
    `
  }

  getConfigs() {
    return [{
      type: "REQUIRED_CHILDREN",
      children: [
        Relay.QL`
          fragment on InitializeFileMutationPayload {
            file
            uploadUrl
          }
        `
      ]
    }]
  }
}
