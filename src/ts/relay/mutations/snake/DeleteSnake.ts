import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

import { DeleteSnakeMutationResponse } from "../../../../__artifacts__/DeleteSnakeMutation.graphql"

export interface DeleteSnakeMutationInput {
  snakeId: Models.Snake[ "id" ]
}

const mutation = graphql`
  mutation DeleteSnakeMutation ($input: DeleteSnakeMutationInput!) {
    deleteSnakeMutation (input: $input) {
      snake { id }
    }
  }
`

export function deleteSnake (deleteSnakeInput: DeleteSnakeMutationInput) {
  const variables = { input: { deleteSnakeInput } }

  return new Promise<DeleteSnakeMutationResponse>((resolve, reject) => {
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
