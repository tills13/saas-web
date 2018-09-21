import { commitMutation, graphql } from "react-relay"
import Environment from "../../environment"

import { UpdateGameMutationResponse } from "../../../../__artifacts__/UpdateGameMutation.graphql"

export interface UpdateGameMutationInput {
  gameId: Models.Game[ "id" ]
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
