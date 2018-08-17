import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

import { CreateSnakeMutationResponse } from "../../../../__artifacts__/CreateSnakeMutation.graphql"

export interface CreateSnakeMutationInput {
  apiVersion: Models.Snake[ "apiVersion" ]
  bountyDescription: Models.Snake[ "bountyDescription" ]
  defaultColor: Models.Snake[ "defaultColor" ]
  devUrl: Models.Snake[ "devUrl" ]
  headId: Models.Snake[ "head" ][ "id" ]
  isBountySnake: Models.Snake[ "isBountySnake" ]
  name: Models.Snake[ "name" ]
  url: Models.Snake[ "url" ]
  visibility: Models.Snake[ "visibility" ]
}

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
