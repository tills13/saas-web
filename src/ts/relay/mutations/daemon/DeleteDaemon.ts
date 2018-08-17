import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

// import { CreateDaemonMutationResponse } from "../../../../__artifacts__/CreateDaemonMutation.graphql"

export interface DeleteDaemonMutationInput {
  daemonId: Models.Daemon[ "id" ]
}

const mutation = graphql`
  mutation DeleteDaemonMutation ($input: DeleteDaemonMutationInput!) {
    deleteDaemonMutation (input: $input) {
      daemonId
    }
  }
`

export function deleteDaemon (deleteDaemonInput: DeleteDaemonMutationInput) {
  const variables = { input: { deleteDaemonInput } }

  return new Promise<any>((resolve, reject) => {
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
