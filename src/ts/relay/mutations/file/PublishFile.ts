import { commitMutation, graphql } from "react-relay"

import Environment from "../../environment"

import { PublishFileMutationInput, PublishFileMutationResponse } from "../../../../__artifacts__/PublishFileMutation.graphql"

const mutation = graphql`
  mutation PublishFileMutation ($input: PublishFileMutationInput!) {
    publishFileMutation (input: $input) {
      publishedFile { id }
    }
  }
`

export function publishFile (publishFileInput: PublishFileMutationInput) {
  const variables = { input: publishFileInput }

  return new Promise<PublishFileMutationResponse>((resolve, reject) => {
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
