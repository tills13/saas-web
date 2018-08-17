import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

import { CreateDaemonMutationResponse } from "../../../../__artifacts__/CreateDaemonMutation.graphql"

export interface CreateDaemonMutationInput {
  description: Models.Daemon[ "description" ]
  name: Models.Daemon[ "name" ]
  url: Models.Daemon[ "url" ]
  visibility: Models.Daemon[ "visibility" ]
}

const mutation = graphql`
  mutation CreateDaemonMutation ($input: CreateDaemonMutationInput!) {
    createDaemonMutation (input: $input) {
      daemon { id }
    }
  }
`

export function createDaemon (createDaemonInput: CreateDaemonMutationInput) {
  const variables = { input: { createDaemonInput } }

  return new Promise<CreateDaemonMutationResponse>((resolve, reject) => {
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
