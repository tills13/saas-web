import "./CreateEditGameForm.scss"

import { WithRouter, withRouter } from "found"
import { isArray } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { compose, withProps } from "recompose"

import { FormProps, withForm } from "utils/hocs"

import Alert, { AlertType } from "../alert"
import Board from "../board"
import ButtonGroup from "../button/button_group"
import Button from "../form/button"
import Checkbox from "../form/checkbox"
import FieldGroup from "../form/field_group"
import Select from "../form/select"
import TextInput from "../form/text_input"
import Icon from "../icon"
// import { MessageModal } from "modals/message_modal"

import {
  enumToSelect,
  GameStatusEnum,
  SPAWN_STRATEGY_RANDOM,
  SpawnStrategyEnum,
  VISIBILITY_PRIVATE,
  VisibilityEnum
} from "relay/enums"

import { createGame, updateGame } from "relay/mutations"

import { CreateGameMutationResponse } from "../../../__artifacts__/CreateGameMutation.graphql"
import { UpdateGameMutationResponse } from "../../../__artifacts__/UpdateGameMutation.graphql"

interface CreateEditGameFormProps extends WithRouter {
  application: GraphQL.Schema.Application
  game?: GraphQL.Schema.Node<Models.Game>
}

class CreateEditGameForm extends React.Component<CreateEditGameFormProps & FormProps> {
  handleSubmit = (_: any, data: any) => {
    const { application, game, router } = this.props
    console.log(data)

    const mutation: Promise<UpdateGameMutationResponse | CreateGameMutationResponse> = game
      ? updateGame({ gameId: game.id, ...data }) : createGame(data)

    return mutation.then(response => {
      const mutationData = (response as UpdateGameMutationResponse).updateGameMutation ||
        (response as CreateGameMutationResponse).createGameMutation

      router.push(`/games/${ mutationData.game.id }/edit`)
    }).catch(console.log)
  }

  showDevModeHelpModal = () => {
    // this.props.showModal(MessageModal, {
    //   title: "Development Mode",
    //   body: (
    //     <div>
    //       When a game is in Development Mode, snakes will be referenced by their <code>Dev URL</code>. If not
    //       set, the normal URL will be used instead.
    //     </div>
    //   )
    // })
  }

  renderDimensionsFields () {
    const { field, formData: { boardConfig } } = this.props

    return (
      <div>
        { boardConfig && (
          <div className="alert alert-info">
            Dimensions will be applied from the selected board configuration&nbsp;
            ({ boardConfig.configuration.boardColumns } x { boardConfig.configuration.boardRows })
          </div>
        ) }
        <FieldGroup>
          <TextInput
            label="Board Columns (Width)"
            type="number"
            disabled={ !!boardConfig }
            { ...field("boardColumns") }
          />
          <TextInput
            label="Board Rows (Height)"
            type="number"
            disabled={ !!boardConfig }
            { ...field("boardRows") }
          />
        </FieldGroup>
      </div>
    )
  }

  renderFoodFields () {
    const { field } = this.props

    return (
      <FieldGroup>
        <TextInput
          label="Food Count"
          type="number"
          { ...field("boardFoodCount") }
        />
        <Select
          label="Food Spawn Strategy"
          options={ enumToSelect(SpawnStrategyEnum) }
          clearable={ false }
          { ...field("boardFoodStrategy") }
        />
      </FieldGroup>
    )
  }

  renderGoldFields () {
    const { field, formData: { boardHasGold } } = this.props

    return (
      <div>
        <FieldGroup>
          <TextInput
            label="Gold Count"
            type="number"
            disabled={ !boardHasGold }
            { ...field("boardGoldCount") }
          />
          <Select
            label="Gold Spawning Strategy"
            options={ enumToSelect(SpawnStrategyEnum) }
            disabled={ !boardHasGold }
            clearable={ false }
            { ...field("boardGoldStrategy") }
          />
        </FieldGroup>
        <FieldGroup>
          <TextInput
            label="Gold Respawn Timeout"
            type="number"
            disabled={ !boardHasGold }
            { ...field("boardGoldRespawnTimeout") }
          />
          <TextInput
            label="Gold Win Threshold"
            type="number"
            disabled={ !boardHasGold }
            { ...field("boardGoldWinningThreshold") }
          />
        </FieldGroup>
      </div>
    )
  }

  renderTeleporterFields () {
    const { field, formData: { boardHasTeleporters } } = this.props

    return (
      <FieldGroup>
        <Checkbox label="Place Teleporters" name="boardHasTeleporters" />
        <div>
          <TextInput
            label="Teleporter Count"
            type="number"
            disabled={ !boardHasTeleporters }
            { ...field("boardTeleporterCount") }
          />
          <p>* denotes teleporter <i>pairs</i>.</p>
        </div>
      </FieldGroup>
    )
  }

  renderTimingFields () {
    const { field } = this.props

    return (
      <FieldGroup>
        <TextInput
          label="API Response Time (ms)"
          type="number"
          { ...field("responseTime") }
        />
        <TextInput
          label="Tick Rate (ms)"
          type="number"
          { ...field("tickRate") }
        />
      </FieldGroup>
    )
  }

  render () {
    const { application, error, field, formData, game, handleSubmit, pristine, reset } = this.props
    const { boardHasGold, boardHasTeleporters, boardHasWalls, selectedBoardConfig, selectedSnakes } = formData
    const { boards, daemons, snakes: { items: snakes } } = application

    const mSelectedSnakes = selectedSnakes && isArray(selectedSnakes) ? selectedSnakes : []

    const hasLegacySnake = mSelectedSnakes
      .map((snakeId) => snakes.find(({ id }) => id === snakeId))
      .reduce((carry, { apiVersion }) => carry || !!apiVersion, false)

    const hasLegacyFeatures = boardHasGold || boardHasTeleporters || boardHasWalls
    const mSelectedBoardConfig = selectedBoardConfig
      ? boards.items.find((boardConfig) => boardConfig.id === selectedBoardConfig)
      : null

    const boardConfigOptions = boards.items.map(boardConfig => ({ label: boardConfig.name, value: boardConfig.id }))
    const daemonOptions = daemons.items.map(daemon => ({ label: daemon.name, value: daemon.id }))
    const snakeOptions = snakes.map(snake => ({ label: snake.name, value: snake.id }))

    return (
      <form className="CreateEditGameForm" onSubmit={ handleSubmit(this.handleSubmit) }>
        { error && <div className="alert alert-danger">{ error }</div> }

        { game && game.status === GameStatusEnum[ "COMPLETED" ] && (
          <Alert alertType={ AlertType.Danger }>
            Game has already been completed - editing will have no effect.
          </Alert>
        ) }

        { hasLegacySnake && hasLegacyFeatures && (
          <Alert alertType={ AlertType.Warning }>
            <Icon icon="alert-octagon" /> Game has non-legacy features and legacy snakes.
          </Alert>
        ) }

        <Select
          label="Snakes"
          options={ snakeOptions }
          searchable
          multiple
          { ...field("snakes") }
        />

        <Checkbox label="Development Mode" { ...field("devMode") } />

        <h5>Board Options</h5>

        { this.renderDimensionsFields() }

        { false && <FieldGroup label="Board Configuration" labelFor="boardConfiguration">
          <Select options={ boardConfigOptions } { ...field("boardConfiguration") } />
          <Button
            disabled={ !mSelectedBoardConfig }
            className="InlineFields__labelOffset"
            tall
          >
            Show Board Configuration
          </Button>
        </FieldGroup> }


        <h5>Food</h5>
        { this.renderFoodFields() }

        <FieldGroup>
          <h5>Gold</h5>
          <Checkbox
            label="Place Gold"
            containerClassName="InlineFields__labelOffset"
            { ...field("boardHasGold") }
          />
        </FieldGroup>

        { this.renderGoldFields() }

        <h5>Misc.</h5>
        { this.renderTimingFields() }

        <Checkbox name="boardHasWalls" label="Place Walls" />

        <FieldGroup>
          <Select label="Daemon" options={ daemonOptions } { ...field("daemon") } />
          <Select
            label="Visibility"
            options={ enumToSelect(VisibilityEnum) }
            clearable={ false }
            { ...field("visibility") }
          />
        </FieldGroup>

        <h5>Teleporters</h5>
        { this.renderTeleporterFields() }

        <ButtonGroup>
          <Button type="submit" disabled={ pristine && !error }>
            { game ? "Update" : "Create" } Game
          </Button>
          <Button type="clear" onClick={ reset }>
            { game ? "Reset" : "Clear" }
          </Button>
        </ButtonGroup>
      </form >
    )
  }
}

export default createFragmentContainer<CreateEditGameFormProps>(
  compose<any, CreateEditGameFormProps>(
    withRouter,
    withProps(({ game }: CreateEditGameFormProps) => ({
      initialFormData: {
        boardColumns: game ? game.boardColumns : 20,
        boardConfiguration: game && game.boardConfiguration ? game.boardConfiguration.id : null,
        boardFoodCount: game ? game.boardFoodCount : 4,
        boardFoodStrategy: game ? game.boardFoodStrategy : SPAWN_STRATEGY_RANDOM,
        boardGoldCount: game ? game.boardGoldCount : 1,
        boardGoldStrategy: game ? game.boardGoldStrategy : SPAWN_STRATEGY_RANDOM,
        boardGoldRespawnTimeout: game ? game.boardGoldRespawnTimeout : 10000,
        boardGoldWinningThreshold: game ? game.boardGoldWinningThreshold : 5,
        boardRows: game ? game.boardRows : 20,
        boardTeleporterCount: game ? game.boardTeleporterCount : 2,
        daemon: game && game.daemon ? game.daemon.id : null,
        devMode: game ? game.devMode : true,
        responseTime: game ? game.responseTime : 100,
        snakes: game ? game.snakes.edges.map(({ node: snake }) => snake.id) : null,
        tickRate: game ? game.tickRate : 100,
        visibility: game ? game.visibility : VISIBILITY_PRIVATE
      }
    })),
    withForm()
  )(CreateEditGameForm),
  {
    application: graphql`
      fragment CreateEditGameForm_application on Application {
        boards (limit: 30) {
          items {
            id
            configuration
            name
            creator { username }
          }
        }

        daemons (limit: 30) {
          items {
            id
            name
            owner { username }
          }
        }

        snakes (limit: 30) {
          items {
            id
            apiVersion
            name
            owner { username }
          }
        }
      }
    `,
    game: graphql`
      fragment CreateEditGameForm_game on Game {
        id
        status
        boardColumns
        boardRows
        boardFoodCount
        boardFoodStrategy
        boardHasGold
        boardGoldCount
        boardGoldStrategy
        boardGoldRespawnTimeout
        boardGoldWinningThreshold
        boardTeleporterCount
        devMode
        responseTime
        tickRate

        snakes(first: 10) {
          edges {
            node {
              id
              name
              owner { username }
            }
          }
        }

        boardConfiguration {
          id
          name
          creator { id, username }
        }

        daemon {
          id
          name
          owner { id, username }
        }

        visibility
      }
    `
  }
)
