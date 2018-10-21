import { commitMutation, graphql } from "react-relay"

import Environment from "../../environment"

import { CreateSnakeMutationInput, CreateSnakeMutationResponse } from "../../../../__artifacts__/CreateSnakeMutation.graphql"

const mutation = graphql`
  mutation CreateSnakeMutation ($input: CreateSnakeMutationInput!) {
    createSnakeMutation (input: $input) {
      snake { id, name }
    }
  }
`

export function createSnake (createSnakeInput: CreateSnakeMutationInput) {
  const variables = { input: { createSnakeInput } }

  return new Promise<CreateSnakeMutationResponse>((resolve, reject) => {
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
