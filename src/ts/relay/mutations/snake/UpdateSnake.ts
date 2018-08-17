import { pick, map } from "lodash"
import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

import { UpdateSnakeMutationResponse } from "../../../../__artifacts__/UpdateSnakeMutation.graphql"

export interface UpdateSnakeMutationInput {
  apiVersion: Models.Snake[ "apiVersion" ]
  bountyDescription: Models.Snake[ "bountyDescription" ]
  defaultColor: Models.Snake[ "defaultColor" ]
  devUrl: Models.Snake[ "devUrl" ]
  headId: Models.Snake[ "head" ][ "id" ]
  isBountySnake: Models.Snake[ "isBountySnake" ]
  name: Models.Snake[ "name" ]
  snakeId: Models.Snake[ "id" ]
  url: Models.Snake[ "url" ]
  visibility: Models.Snake[ "visibility" ]
}

const fields = [
  "apiVersion", "bountyDescription", "defaultColor", "devUrl",
  "headId", "isBountySnake", "name", "snakeId", "url", "visibility"
]

const defaultObject = fields.reduce((carry, field) => {
  carry[ field ] = ""
  return carry
}, {})

function normalize<T extends object> (input: T & any): T {
  return Object.assign(
    defaultObject,
    pick<T>(input, fields) as any
  )
}

const mutation = graphql`
  mutation UpdateSnakeMutation ($input: UpdateSnakeMutationInput!) {
    updateSnakeMutation (input: $input) {
      snake { id }
    }
  }
`

export function updateSnake (updateSnakeInput: UpdateSnakeMutationInput) {
  let mUpdateSnakeInput = normalize<UpdateSnakeMutationInput>(updateSnakeInput)
  const variables = { input: { updateSnakeInput: mUpdateSnakeInput } }

  return new Promise<UpdateSnakeMutationResponse>((resolve, reject) => {
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
