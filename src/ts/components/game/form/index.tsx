import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"

import { showModal } from "actions"
import { isArray } from "lodash"
import { PropTypes } from "prop-types"
import { connect } from "react-redux"
import { compose, getContext, mapProps } from "recompose"
import { Field, formValueSelector, InjectedFormProps, reduxForm } from "redux-form"
import { ApplicationState } from "../../../store"

import Alert from "components/alert"
import Board from "components/board"
import ButtonGroup from "components/button/button_group"
import Button from "components/form/button"
import Checkbox from "components/form/checkbox"
import FieldGroup from "components/form/field_group"
import Select from "components/form/select"
import TextInput from "components/form/text_input"
import Icon from "components/icon"
import { MessageModal } from "components/modal/message_modal"

import {
  enumToSelect,
  GameStatusEnum,
  SPAWN_STRATEGY_RANDOM,
  SpawnStrategyEnum,
  VISIBILITY_PRIVATE,
  VisibilityEnum
} from "relay/enums"
import { CreateGameMutation, UpdateGameMutation } from "relay/mutations"

import createRelayContainer from "components/create_relay_container"
import { showErrorNotification, showNotification } from "components/notification"
import { withMutation } from "utils/enhancers"

interface CreateOrEditGameFormInnerProps extends CreateOrEditGameFormOuterProps, InjectedFormProps {
  formValues: {
    boardConfig: Models.BoardInterface
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
  game?: GraphQL.Schema.Node<Models.GameInterface>
}

class CreateOrEditGameForm extends React.Component<CreateOrEditGameFormInnerProps, any> {
  handleSubmit = (data: any) => {
    const { application, game, mutate, router } = this.props

    return mutate({
      applicationId: application.id,
      gameId: game ? game.id : null,
      ...data
    }).then((response) => {
      const mGame = game
        ? response.updateGameMutation.game
        : response.createGameMutation.game

      showNotification(`Successfully ${ game ? "updated" : "updated" } game`)

      if (mGame) router.push(`/games/${ mGame.id }/edit`)
    }).catch(({ errors }) => {
      showErrorNotification(errors[0].message, null, { timeout: -1 })
    })
  }

  showDevModeHelpModal = () => {
    this.props.showModal(MessageModal, {
      title: "Development Mode",
      body: (
        <div>
          When a game is in Development Mode, snakes will be referenced by their <code>Dev URL</code>. If not
          set, the normal URL will be used instead.
        </div>
      )
    })
  }

  renderDimensionsFields () {
    const { formValues: { boardConfig } } = this.props

    return (
      <div>
        { boardConfig && (
          <div className="alert alert-info">
            Dimensions will be applied from the selected board configuration&nbsp;
            ({ boardConfig.configuration.boardColumns } x { boardConfig.configuration.boardRows })
          </div>
        ) }
        <FieldGroup>
          <Field
            label="Board Columns (Width)"
            name="boardColumns"
            component={ TextInput }
            type="number"
            disabled={ !!boardConfig }
          />
          <Field
            label="Board Rows (Height)"
            name="boardRows"
            component={ TextInput }
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
        <Field
          label="Food Count"
          name="boardFoodCount"
          component={ TextInput }
          type="number"
        />
        <Field
          label="Food Spawn Strategy"
          name="boardFoodStrategy"
          component={ Select }
          options={ enumToSelect(SpawnStrategyEnum) }
          clearable={ false }
        />
      </FieldGroup>
    )
  }

  renderGoldFields () {
    const { formValues: { boardHasGold } } = this.props

    return (
      <div>
        <FieldGroup>
          <Field
            label="Place Gold"
            name="boardHasGold"
            component={ Checkbox }
            containerClassName="InlineFields__labelOffset"
          />
          <Field
            label="Gold Count"
            name="boardGoldCount"
            component={ TextInput }
            type="number"
            disabled={ !boardHasGold }
          />
          <Field
            label="Gold Spawning Strategy"
            name="boardGoldStrategy"
            component={ Select }
            options={ enumToSelect(SpawnStrategyEnum) }
            disabled={ !boardHasGold }
            clearable={ false }
          />
        </FieldGroup>
        <FieldGroup>
          <Field
            label="Gold Respawn Timeout"
            name="boardGoldRespawnTimeout"
            component={ TextInput }
            type="number"
            disabled={ !boardHasGold }
          />
          <Field
            label="Gold Win Threshold"
            name="boardGoldWinningThreshold"
            component={ TextInput }
            type="number"
            disabled={ !boardHasGold }
          />
        </FieldGroup>
      </div>
    )
  }

  renderTeleporterFields () {
    const { formValues: { boardHasTeleporters } } = this.props

    return (
      <FieldGroup>
        <Field label="Place Teleporters" name="boardHasTeleporters" component={ Checkbox } />
        <div>
          <Field
            label="Teleporter Count"
            name="boardTeleporterCount"
            component={ TextInput }
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
        <Field
          label="API Response Time (ms)"
          name="responseTime"
          component={ TextInput }
          type="number"
        />
        <Field
          label="Tick Rate (ms)"
          name="tickRate"
          component={ TextInput }
          type="number"
        />
      </FieldGroup>
    )
  }

  render () {
    const { application, error, formValues, game, handleSubmit, pristine, reset } = this.props
    const { boardHasGold, boardHasTeleporters, boardHasWalls, devMode, selectedBoardConfig, selectedSnakes } = formValues
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

        { game && game.status === GameStatusEnum["COMPLETED"] && (
          <Alert type={ Alert.TYPE_DANGER }>
            Game has already been completed - editing will have no effect.
          </Alert>
        ) }

        { hasLegacySnake && hasLegacyFeatures && (
          <Alert type={ Alert.TYPE_WARNING }>
            <Icon icon="alert-octagon" /> Game has non-legacy features and legacy snakes.
          </Alert>
        ) }

        { false && (
          <div className="alert alert-success">
            Successfully { game ? "updated" : "created" } your game.
          </div>
        ) }

        <Field
          name="snakes"
          label="Snakes"
          component={ Select }
          options={ snakes.map((snake) => ({ label: snake.name, value: snake.id })) }
          searchable
          multiple
        />

        <FieldGroup>
          <Field
            name="devMode"
            label="Development Mode"
            component={ Checkbox }
          />
          { devMode && (
            <Alert type={ Alert.TYPE_WARNING } inline>
              <Icon icon="alert-octagon" onClick={ this.showDevModeHelpModal } /> Dev mode is enabled.
            </Alert>
          ) }
        </FieldGroup>

        <h5 className="CreateOrEditGameForm__sectionTitle">Board Options</h5>

        { this.renderDimensionsFields() }

        <FieldGroup label="Board Configuration" labelFor="boardConfiguration">
          <Field
            name="boardConfiguration"
            component={ Select }
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
        </FieldGroup>


        <h5 className="CreateOrEditGameForm__sectionTitle">Food</h5>
        { this.renderFoodFields() }

        <h5 className="CreateOrEditGameForm__sectionTitle">Gold</h5>
        { this.renderGoldFields() }

        <h5 className="CreateOrEditGameForm__sectionTitle">Misc.</h5>
        { this.renderTimingFields() }

        <Field name="boardHasWalls" label="Place Walls" component={ Checkbox } />

        <FieldGroup>
          <Field
            name="daemon"
            label="Daemon"
            component={ Select }
            options={ daemons.items.map((daemon) => {
              return { label: daemon.name, value: daemon.id }
            }) }
          />
          <Field
            label="Visibility"
            name="visibility"
            component={ Select }
            options={ enumToSelect(VisibilityEnum) }
            clearable={ false }
          />
        </FieldGroup>

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

const cOrEGameFormSelector = formValueSelector("CreateOrEditGameForm")

export default compose<CreateOrEditGameFormInnerProps, CreateOrEditGameFormOuterProps>(
  createRelayContainer({
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          id
          boards(limit: 30) {
            items {
              id
              configuration
              name
              creator { username }
            }
          }
          daemons(limit: 30) {
            items {
              id
              name
              owner { username }
            }
          }
          snakes(limit: 30) {
            items {
              id
              apiVersion
              name
              owner { username }
            }
          }
        }
      `,
      game: () => Relay.QL`
        fragment on Game {
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
                owner {
                  username
                }
              }
            }
          }
          boardConfiguration {
            id
            name
            creator {
              id
              username
            }
          }
          daemon {
            id
            name
            owner {
              id
              username
            }
          }
          visibility
        }
      `
    }
  }),
  connect((state: ApplicationState) => {
    return {
      formValues: {
        boardHasGold: cOrEGameFormSelector(state, "boardHasGold"),
        boardHasTeleporters: cOrEGameFormSelector(state, "boardHasTeleporters"),
        boardHasWalls: cOrEGameFormSelector(state, "boardHasWalls"),
        devMode: cOrEGameFormSelector(state, "devMode"),
        selectedBoardConfig: cOrEGameFormSelector(state, "boardConfiguration"),
        selectedSnakes: cOrEGameFormSelector(state, "snakes")
      }
    }
  }, { showModal }),
  mapProps(({ game, ...rest }: CreateOrEditGameFormInnerProps) => {
    return {
      initialValues: {
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
      },
      game,
      ...rest
    }
  }),
  reduxForm({
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    form: "CreateOrEditGameForm"
  }),
  getContext({ router: PropTypes.object }),
  withMutation((props) => props.game ? UpdateGameMutation : CreateGameMutation)
)(CreateOrEditGameForm)


