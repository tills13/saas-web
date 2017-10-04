import * as React from "react"
import * as Relay from "react-relay/classic"

import ButtonGroup from "components/button/button_group"
import Code from "components/code"
import Button from "components/form/button"
import ColorPicker from "components/form/color_picker"
import FieldGroup from "components/form/field_group"
import Select from "components/form/select"
import TextInput from "components/form/text_input"

import createRelayContainer from "components/create_relay_container"

import {
  CELL_TYPE_FOOD,
  CELL_TYPE_GOLD,
  CELL_TYPE_SNAKE,
  CELL_TYPE_TELEPORTER,
  CELL_TYPE_WALL,
  PlacementType
} from ".."

import { ExtraOptions, OPTION_SNAKE_ID, OPTION_TELEPORTER_CHANNEL, OPTION_COLOR } from "./index"

const placementOptions = [
  { label: "Food", value: CELL_TYPE_FOOD },
  { label: "Gold", value: CELL_TYPE_GOLD },
  { label: "Snake", value: CELL_TYPE_SNAKE },
  { label: "Teleporter", value: CELL_TYPE_TELEPORTER },
  { label: "Wall", value: CELL_TYPE_WALL }
]

interface BoardEditorSidebarProps {
  application: GraphQL.Schema.Application
  boardColumns: number
  boardRows: number
  extraOptions: ExtraOptions
  name: string
  onChangeExtraOptions: (mergeOptions: Partial<ExtraOptions>) => void
  onChangePlacementType: (newPlacementType: PlacementType) => void
  placementType: PlacementType
}

class BoardEditorSidebar extends React.Component<BoardEditorSidebarProps> {
  state: any = { inputs: {} }

  onInputChanged = () => {

  }

  renderColorOptions() {
    const { extraOptions, onChangeExtraOptions } = this.props
    const onChange = (eventOrValue) => {
      return onChangeExtraOptions({
        [OPTION_COLOR]: typeof eventOrValue === "string"
          ? eventOrValue
          : eventOrValue.target.value
      })
    }

    return (
      <ColorPicker
        label="Color"
        name="channel"
        placeholder="Color"
        onChange={ onChange }
        value={ extraOptions[OPTION_COLOR] || "#000000" }
      />
    )
  }

  renderExtraOptions() {
    const { placementType } = this.props

    if (placementType === CELL_TYPE_TELEPORTER) {
      return this.renderTeleporterOptions()
    } else if (placementType === CELL_TYPE_WALL) {
      return this.renderWallOptions()
    } else if (placementType === CELL_TYPE_SNAKE) {
      return this.renderSnakeOptions()
    }

    return null
  }

  renderSnakeOptions() {
    const { application, extraOptions, onChangeExtraOptions } = this.props
    const onChange = (eventOrValue: React.ChangeEvent<HTMLInputElement>) => {
      return onChangeExtraOptions({
        [OPTION_SNAKE_ID]: typeof eventOrValue === "string" || eventOrValue == null
          ? eventOrValue
          : eventOrValue.target.value
      })
    }

    const options = application.snakes.items.map((snake) => {
      return { label: snake.name, value: snake.id }
    })

    return (
      <FieldGroup label="Snake" vertical>
        <Select
          name="snake"
          onChange={ onChange }
          options={ options }
          value={ extraOptions[OPTION_SNAKE_ID] }
        />
        <TextInput
          name="snakeId"
          placeholder="Snake Id"
          onChange={ onChange }
          value={ extraOptions[OPTION_SNAKE_ID] || "" }
        />
      </FieldGroup>
    )
  }

  renderTeleporterOptions() {
    const { extraOptions, onChangeExtraOptions } = this.props
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      return onChangeExtraOptions({ [OPTION_TELEPORTER_CHANNEL]: event.target.value })
    }

    return (
      <TextInput
        label="Teleporter Channel"
        name="channel"
        placeholder="Teleporter Channel"
        onChange={ onChange }
        value={ extraOptions[OPTION_TELEPORTER_CHANNEL] || "" }
      />
    )
  }

  renderWallOptions() {

  }

  render() {
    const { onChangePlacementType, placementType } = this.props

    return (
      <div className="BoardEditorSidebar">
        <TextInput
          label="Board Name"
          placeholder="Board Name"
          onChange={ this.onInputChanged.bind(null, "name", null) }
          value={ this.props.name }
        />

        <FieldGroup label="Dimensions">
          <TextInput
            type="number"
            onChange={ this.onInputChanged.bind(null, "boardRows", (value) => parseInt(value, 10)) }
            value={ this.props.boardRows }
          />
          <TextInput
            type="number"
            onChange={ this.onInputChanged.bind(null, "boardColumns", (value) => parseInt(value, 10)) }
            value={ this.props.boardColumns }
          />
        </FieldGroup>

        <Select
          label="Placement Type"
          name="placementOption"
          onChange={ onChangePlacementType }
          options={ placementOptions }
          placeholder="Placement Type"
          showValue={ false }
          value={ placementType }
          clearable={ false }
        />

        { this.renderColorOptions() }
        { this.renderExtraOptions() }

        <ButtonGroup>
          <Button>Create Board</Button>
          <Button>Reset Board</Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default createRelayContainer({
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        snakes(limit: 100) {
          items { id, name }
        }
      }
    `
  }
})(BoardEditorSidebar)
