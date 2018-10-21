import { commitMutation, graphql } from "react-relay"

import Environment from "../../environment"

import { UpdateGameMutationInput, UpdateGameMutationResponse } from "../../../../__artifacts__/UpdateGameMutation.graphql"

const mutation = graphql`
  mutation UpdateGameMutation ($input: UpdateGameMutationInput!) {
    updateGameMutation (input: $input) {
      game {
        id, boardRows, boardColumns,
        boardConfiguration { configuration }
      }
    }
  }
`

export function updateGame (updateGameInput: UpdateGameMutationInput) {
  const variables = { input: { updateGameInput } }

  return new Promise<UpdateGameMutationResponse>((resolve, reject) => {
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
