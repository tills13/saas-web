import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

import { UpdateDaemonMutationResponse } from "../../../../__artifacts__/UpdateDaemonMutation.graphql"

export interface UpdateDaemonMutationInput {
  daemonId: Models.Daemon[ "id" ]
  description: Models.Daemon[ "description" ]
  name: Models.Daemon[ "name" ]
  url: Models.Daemon[ "url" ]
  visibility: Models.Daemon[ "visibility" ]
}

const mutation = graphql`
  mutation UpdateDaemonMutation ($input: UpdateDaemonMutationInput!) {
    updateDaemonMutation (input: $input) {
      daemon { id }
    }
  }
`

export function updateDaemon (updateDaemonInput: UpdateDaemonMutationInput) {
  const variables = { input: { updateDaemonInput } }

  return new Promise<UpdateDaemonMutationResponse>((resolve, reject) => {
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
