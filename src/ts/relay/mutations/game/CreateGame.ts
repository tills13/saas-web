import { commitMutation, graphql } from "react-relay"

import Environment from "../../environment"

import { CreateGameMutationInput, CreateGameMutationResponse } from "../../../../__artifacts__/CreateGameMutation.graphql"

const mutation = graphql`
  mutation CreateGameMutation ($input: CreateGameMutationInput!) {
    createGameMutation (input: $input) {
      game { id }
    }
  }
`

export function createGame (createGameInput: CreateGameMutationInput) {
  const variables = { input: { createGameInput } }

  return new Promise<CreateGameMutationResponse>((resolve, reject) => {
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
