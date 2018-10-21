import { commitMutation, graphql } from "react-relay"

import Environment from "../../environment"

import { InitializeFileMutationInput, InitializeFileMutationResponse } from "../../../../__artifacts__/InitializeFileMutation.graphql"

const mutation = graphql`
  mutation InitializeFileMutation ($input: InitializeFileMutationInput!) {
    initializeFileMutation (input: $input) {
      file { id }, uploadUrl
    }
  }
`

export function initializeFile (initializeFileInput: InitializeFileMutationInput) {
  const variables = { input: initializeFileInput }

  return new Promise<InitializeFileMutationResponse>((resolve, reject) => {
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
