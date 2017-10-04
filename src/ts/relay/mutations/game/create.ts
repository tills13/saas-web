import * as Relay from "react-relay/classic"

interface CreateGameMutationProps {
  applicationId: GraphQL.Schema.GraphQLID
  boardColumns: number
  boardConfiguration: string
  boardFoodCount: string
  boardFoodStrategy: string
  boardGoldCount: number
  boardGoldStrategy: string
  boardGoldRespawnTimeout: string
  boardGoldWinningThreshold: string
  boardHasGold: string
  boardRows: number
  boardTeleporterCount: number
  daemon: string
  devMode: boolean
  responseTime: number
  snakes: string[]
  tickRate: number
  turnLimit: number
  visibility: string
}

export class CreateGameMutation extends Relay.Mutation<CreateGameMutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { createGameMutation }`
  }

  getVariables() {
    return {
      createGameInput: {
        boardColumns: this.props.boardColumns,
        boardConfiguration: this.props.boardConfiguration,
        boardFoodCount: this.props.boardFoodCount,
        boardFoodStrategy: this.props.boardFoodStrategy,
        boardGoldCount: this.props.boardGoldCount,
        boardGoldStrategy: this.props.boardGoldStrategy,
        boardGoldRespawnTimeout: this.props.boardGoldRespawnTimeout,
        boardGoldWinningThreshold: this.props.boardGoldWinningThreshold,
        boardHasGold: this.props.boardHasGold,
        boardRows: this.props.boardRows,
        boardTeleporterCount: this.props.boardTeleporterCount,
        daemon: this.props.daemon,
        devMode: this.props.devMode,
        responseTime: this.props.responseTime,
        snakes: this.props.snakes,
        tickRate: this.props.tickRate,
        turnLimit: this.props.turnLimit,
        visibility: this.props.visibility
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateGameMutationPayload {
        application { games }
        game
      }
    `
  }

  getConfigs() {
    return [
      {
        type: "REQUIRED_CHILDREN",
        children: [
          Relay.QL`
          fragment on CreateGameMutationPayload {
            game { id }
          }
        `
        ]
      }, {
        type: "FIELDS_CHANGE",
        fieldIDs: {
          application: this.props.applicationId
        }
      }
    ]
  }
}
