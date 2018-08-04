import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import ButtonGroup from "components/button/button_group"
import Code from "components/code"
import Button from "components/form/button"
import ColorPicker from "components/form/color_picker"
import FieldGroup from "components/form/field_group"
import Select from "components/form/select"
import TextInput from "components/form/text_input"

import { CellType } from "."
import { CellExtraOptions, CellOption } from "./BoardEditor"

interface BoardEditorSidebarProps {
  application: GraphQL.Schema.Application
  configuration: Models.Board[ "configuration" ]
  extraOptions: CellExtraOptions
  onChangeOption: (mergeOptions: Partial<Models.Board[ "configuration" ]>) => void
  onChangeExtraOptions: (mergeOptions: Partial<CellExtraOptions>) => void
  onChangePlacementType: (newPlacementType: CellType) => void
  placementType: CellType
}

interface BoardEditorSidebarState {
  inputs: { [ inputName: string ]: any }
}

class BoardEditorSidebar extends React.Component<BoardEditorSidebarProps, BoardEditorSidebarState> {
  state: BoardEditorSidebarState = { inputs: {} }

  onInputChanged = (name: keyof Models.Board[ "configuration" ], parseValue: (value: string) => any, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseValue ? parseValue(event.target.value) : event.target.value
    this.props.onChangeOption({ [ name ]: value })
  }

  renderColorOptions () {
    const { extraOptions, onChangeExtraOptions } = this.props
    const onChange = (eventOrValue) => {
      return onChangeExtraOptions({
        [ CellOption.Color ]: typeof eventOrValue === "string"
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
        value={ extraOptions[ CellOption.Color ] || "#000000" }
      />
    )
  }

  renderExtraOptions () {
    const { placementType } = this.props

    if (placementType === CellType.Teleporter) {
      return this.renderTeleporterOptions()
    } else if (placementType === CellType.Wall) {
      return this.renderWallOptions()
    } else if (placementType === CellType.Snake) {
      return this.renderSnakeOptions()
    }

    return null
  }

  renderSnakeOptions () {
    const { application, extraOptions, onChangeExtraOptions } = this.props
    const onChange = (eventOrValue: React.ChangeEvent<HTMLInputElement> | string) => {
      return onChangeExtraOptions({
        [ CellOption.SnakeId ]: typeof eventOrValue === "string"
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
          value={ extraOptions[ CellOption.SnakeId ] }
        />
        <TextInput
          name="snakeId"
          placeholder="Snake Id"
          onChange={ onChange as React.ChangeEventHandler }
          value={ extraOptions[ CellOption.SnakeId ] || "" }
        />
      </FieldGroup>
    )
  }

  renderTeleporterOptions () {
    const { extraOptions, onChangeExtraOptions } = this.props
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      return onChangeExtraOptions({ [ CellOption.TeleporterChannel ]: event.target.value })
    }

    return (
      <TextInput
        label="Teleporter Channel"
        name="channel"
        placeholder="Teleporter Channel"
        onChange={ onChange }
        value={ extraOptions[ CellOption.TeleporterChannel ] || "" }
      />
    )
  }

  renderWallOptions () {

  }

  render () {
    const { configuration, onChangePlacementType, placementType } = this.props

    const placementOptions = [
      { label: "Food", value: CellType.Food },
      { label: "Gold", value: CellType.Gold },
      { label: "Snake", value: CellType.Snake },
      { label: "Teleporter", value: CellType.Teleporter },
      { label: "Wall", value: CellType.Wall }
    ]

    return (
      <div className="BoardEditorSidebar">
        <TextInput
          label="Board Name"
          placeholder="Board Name"
          onChange={ this.onInputChanged.bind(null, "name", null) }
          value={ "" }
        />

        <FieldGroup label="Dimensions">
          <TextInput
            type="number"
            onChange={ this.onInputChanged.bind(null, "boardRows", (value) => parseInt(value, 10)) }
            value={ configuration.boardRows }
          />
          <TextInput
            type="number"
            onChange={ this.onInputChanged.bind(null, "boardColumns", (value) => parseInt(value, 10)) }
            value={ configuration.boardColumns }
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

export default createFragmentContainer(
  BoardEditorSidebar,
  graphql`
    fragment BoardEditorSidebar_application on Application {
      snakes (limit: 100) {
        items { id, name }
      }
    }
  `
)
