import { commitMutation, graphql } from "react-relay"

import Environment from "../../environment"

import { DeleteDaemonMutationInput, DeleteDaemonMutationResponse } from "../../../../__artifacts__/DeleteDaemonMutation.graphql"

const mutation = graphql`
  mutation DeleteDaemonMutation ($input: DeleteDaemonMutationInput!) {
    deleteDaemonMutation (input: $input) {
      daemonId
    }
  }
`

export function deleteDaemon (deleteDaemonInput: DeleteDaemonMutationInput) {
  const variables = { input: { deleteDaemonInput } }

  return new Promise<DeleteDaemonMutationResponse>((resolve, reject) => {
    commitMutation(Environment, {
      mutation,
      onCompleted (response, errors) {
        if (errors && errors.length > 0) {
          reject(errors)
          return
        }

        resolve(response)
      },
      onError: reject,
      variables
    })
  })
}
