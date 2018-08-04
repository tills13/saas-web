import "./CreateEditGameForm.scss"

import { isArray } from "lodash"
import { PropTypes } from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { createFragmentContainer, graphql } from "react-relay"
import { compose, getContext, mapProps } from "recompose"

import { showModal } from "actions"
import { withForm } from "utils/hocs"
import { ApplicationState } from "store"

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

import { showErrorNotification, showNotification } from "../notification"

interface CreateEditGameFormProps {
  application: GraphQL.Schema.Application
  formData: any
  game: Models.Game
}

interface CreateOrEditGameFormInnerProps extends CreateOrEditGameFormOuterProps {
  formValues: {
    boardConfig: Models.Board
    boardHasGold: boolean
    boardHasTeleporters: boolean
    boardHasWalls: boolean
    devMode: boolean
    selectedBoardConfig: string
    selectedSnakes: string[]
  }
  mutate: (data: any) => Promise<any>
  router: any
  showModal: typeof showModal
}

interface CreateOrEditGameFormOuterProps {
  application: GraphQL.Schema.Application
  game?: GraphQL.Schema.Node<Models.Game>
}

class CreateOrEditGameForm extends React.Component<CreateEditGameFormProps, any> {
  handleSubmit = (data: any) => {
    const { application, game } = this.props

    // return mutate({
    //   applicationId: application.id,
    //   gameId: game ? game.id : null,
    //   ...data
    // }).then((response) => {
    //   const mGame = game
    //     ? response.updateGameMutation.game
    //     : response.createGameMutation.game

    //   showNotification(`Successfully ${ game ? "updated" : "updated" } game`)

    //   if (mGame) router.push(`/games/${ mGame.id }/edit`)
    // }).catch(({ errors }) => {
    //   showErrorNotification(errors[ 0 ].message, null, { timeout: -1 })
    // })
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
    const { formData: { boardConfig } } = this.props

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
            name="boardColumns"
            type="number"
            disabled={ !!boardConfig }
          />
          <TextInput
            label="Board Rows (Height)"
            name="boardRows"
            type="number"
            disabled={ !!boardConfig }
          />
        </FieldGroup>
      </div>
    )
  }

  renderFoodFields () {
    return (
      <FieldGroup>
        <TextInput
          label="Food Count"
          name="boardFoodCount"
          type="number"
        />
        <Select
          label="Food Spawn Strategy"
          name="boardFoodStrategy"
          options={ enumToSelect(SpawnStrategyEnum) }
          clearable={ false }
        />
      </FieldGroup>
    )
  }

  renderGoldFields () {
    const { formData: { boardHasGold } } = this.props

    return (
      <div>
        <FieldGroup>
          <Checkbox
            label="Place Gold"
            name="boardHasGold"
            containerClassName="InlineFields__labelOffset"
          />
          <TextInput
            label="Gold Count"
            name="boardGoldCount"
            type="number"
            disabled={ !boardHasGold }
          />
          <Select
            label="Gold Spawning Strategy"
            name="boardGoldStrategy"
            options={ enumToSelect(SpawnStrategyEnum) }
            disabled={ !boardHasGold }
            clearable={ false }
          />
        </FieldGroup>
        <FieldGroup>
          <TextInput
            label="Gold Respawn Timeout"
            name="boardGoldRespawnTimeout"
            type="number"
            disabled={ !boardHasGold }
          />
          <TextInput
            label="Gold Win Threshold"
            name="boardGoldWinningThreshold"
            type="number"
            disabled={ !boardHasGold }
          />
        </FieldGroup>
      </div>
    )
  }

  renderTeleporterFields () {
    const { formData: { boardHasTeleporters } } = this.props

    return (
      <FieldGroup>
        <Checkbox label="Place Teleporters" name="boardHasTeleporters" />
        <div>
          <TextInput
            label="Teleporter Count"
            name="boardTeleporterCount"
            type="number"
            disabled={ !boardHasTeleporters }
          />
          <p>* denotes teleporter <i>pairs</i>.</p>
        </div>
      </FieldGroup>
    )
  }

  renderTimingFields () {
    return (
      <FieldGroup>
        <TextInput
          label="API Response Time (ms)"
          name="responseTime"
          type="number"
        />
        <TextInput
          label="Tick Rate (ms)"
          name="tickRate"
          type="number"
        />
      </FieldGroup>
    )
  }

  render () {
    const { application, error, formData, game, handleSubmit, pristine, reset } = this.props
    const { boardHasGold, boardHasTeleporters, boardHasWalls, devMode, selectedBoardConfig, selectedSnakes } = formData
    const { boards, daemons, snakes: { items: snakes } } = application

    const mSelectedSnakes = selectedSnakes && isArray(selectedSnakes)
      ? selectedSnakes : []

    const hasLegacySnake = mSelectedSnakes
      .map((snakeId) => snakes.find(({ id }) => id === snakeId))
      .reduce((carry, { apiVersion }) => carry || !!apiVersion, false)

    const hasLegacyFeatures = boardHasGold || boardHasTeleporters || boardHasWalls
    const mSelectedBoardConfig = selectedBoardConfig
      ? boards.items.find((boardConfig) => boardConfig.id === selectedBoardConfig)
      : null

    return (
      <form className="CreateOrEditGameForm" onSubmit={ handleSubmit(this.handleSubmit) }>
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

        { false && (
          <div className="alert alert-success">
            Successfully { game ? "updated" : "created" } your game.
          </div>
        ) }

        <Select
          name="snakes"
          label="Snakes"
          options={ snakes.map((snake) => ({ label: snake.name, value: snake.id })) }
          searchable
          multiple
        />

        <FieldGroup>
          <Checkbox
            name="devMode"
            label="Development Mode"
          />
          { devMode && (
            <Alert alertType={ AlertType.Warning } inline>
              <Icon icon="alert-octagon" onClick={ this.showDevModeHelpModal } /> Dev mode is enabled.
            </Alert>
          ) }
        </FieldGroup>

        <h5 className="CreateOrEditGameForm__sectionTitle">Board Options</h5>

        { this.renderDimensionsFields() }

        { false && <FieldGroup label="Board Configuration" labelFor="boardConfiguration">
          <Select
            name="boardConfiguration"
            options={ boards.items.map((boardConfig) => {
              return { label: boardConfig.name, value: boardConfig.id }
            }) }
          />
          <Button
            disabled={ !mSelectedBoardConfig }
            className="InlineFields__labelOffset"
            tall
          >
            Show Board Configuration
          </Button>
        </FieldGroup> }


        <h5 className="CreateOrEditGameForm__sectionTitle">Food</h5>
        { this.renderFoodFields() }

        <h5 className="CreateOrEditGameForm__sectionTitle">Gold</h5>
        { this.renderGoldFields() }

        <h5 className="CreateOrEditGameForm__sectionTitle">Misc.</h5>
        { this.renderTimingFields() }

        <Checkbox name="boardHasWalls" label="Place Walls" />

        { false && <FieldGroup>
          <Select
            name="daemon"
            label="Daemon"
            options={ daemons.items.map((daemon) => {
              return { label: daemon.name, value: daemon.id }
            }) }
          />
          <Select
            label="Visibility"
            name="visibility"
            options={ enumToSelect(VisibilityEnum) }
            clearable={ false }
          />
        </FieldGroup> }

        <h5 className="CreateOrEditGameForm__sectionTitle">Teleporters</h5>
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

export default createFragmentContainer(
  withForm()(CreateOrEditGameForm),
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
