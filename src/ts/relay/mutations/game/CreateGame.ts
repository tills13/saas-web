import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

import { CreateGameMutationResponse } from "../../../../__artifacts__/CreateGameMutation.graphql"

export interface CreateGameMutationInput {
  boardColumns: Models.Game[ "boardColumns" ]
  boardConfiguration: Models.Game[ "boardConfiguration" ]
  boardFoodCount: Models.Game[ "boardFoodCount" ]
  boardFoodStrategy: Models.Game[ "boardFoodStrategy" ]
  boardGoldCount: Models.Game[ "boardGoldCount" ]
  boardGoldStrategy: Models.Game[ "boardGoldStrategy" ]
  boardGoldRespawnTimeout: Models.Game[ "boardGoldRespawnTimeout" ]
  boardGoldWinningThreshold: Models.Game[ "boardGoldWinningThreshold" ]
  boardHasGold: Models.Game[ "boardHasGold" ]
  boardRows: Models.Game[ "boardRows" ]
  boardTeleporterCount: Models.Game[ "boardTeleporterCount" ]
  daemon: Models.Game[ "daemon" ]
  devMode: Models.Game[ "devMode" ]
  responseTime: Models.Game[ "responseTime" ]
  snakes: string[]
  tickRate: Models.Game[ "tickRate" ]
  turnLimit: Models.Game[ "turnLimit" ]
  visibility: Models.Game[ "visibility" ]
}

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
