import "./BoardEditor.scss"

import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import Board, { CellType, RenderMethod } from "."
import Container from "../Container"
import Sidebar from "./BoardEditorSidebar"

export enum CellOption { Color, SnakeId, TeleporterChannel }
export type CellExtraOptions = {
  [ CellOption.Color ]?: string
  [ CellOption.SnakeId ]?: string
  [ CellOption.TeleporterChannel ]?: string
}

const CELL_TYPES = [
  CellType.Food,
  CellType.Gold,
  CellType.Snake,
  CellType.Teleporter,
  CellType.Wall
]

const CELL_TYPE_MAP = {
  [ CellType.Food ]: "food",
  [ CellType.Gold ]: "gold",
  [ CellType.Snake ]: "snakes",
  [ CellType.Teleporter ]: "teleporters",
  [ CellType.Wall ]: "walls"
}

const defaultConfiguration = {
  name: "Board Name",
  boardRows: 20,
  boardColumns: 20,
  food: [],
  gold: [],
  snakes: [],
  teleporters: [],
  walls: []
}

const defaultExtraOptions: CellExtraOptions = {
  [ CellOption.Color ]: "#000000",
  [ CellOption.TeleporterChannel ]: "1"
}

interface BoardEditorProps {
  application: GraphQL.Schema.Application
  board?: Models.Board
}

interface BoardEditorState {
  configuration: typeof defaultConfiguration
  extraOptions: CellExtraOptions
  placementType: CellType
}

class BoardEditor extends React.Component<BoardEditorProps, BoardEditorState> {
  constructor (props) {
    super(props)

    this.state = {
      configuration: props.configuration ? props.configuration : defaultConfiguration,
      extraOptions: defaultExtraOptions,
      placementType: CellType.Food
    }
  }

  onChangeExtraOption = (mergeOptions: Partial<BoardEditorState[ "extraOptions" ]>) => {
    const mExtraOptions = Object.assign(this.state.extraOptions, mergeOptions)
    this.setState({ extraOptions: mExtraOptions })
  }

  onChangeOption = (mergeOptions: Partial<BoardEditorState[ "configuration" ]>) => {
    const mConfiguration = Object.assign(this.state.configuration, mergeOptions)
    this.setState({ configuration: mConfiguration })
  }


  onChangePlacementType = (placementType: CellType) => {
    this.setState({ placementType })
  }

  onClickCell = (x: number, y: number) => {
    const { configuration, extraOptions, placementType } = this.state

    CELL_TYPES.forEach((type) => {
      if (type !== placementType) {
        const items = configuration[ CELL_TYPE_MAP[ type ] ]
        configuration[ CELL_TYPE_MAP[ type ] ] = items.filter((item) => item.x !== x || item.y !== y)
      }
    })

    let items: any[] = configuration[ CELL_TYPE_MAP[ placementType ] ]
    let itemOfTypeAtPosition = items.find((item) => item.x === x && item.y === y)
    const color: string = extraOptions[ CellOption.Color ] || "#000000"

    if (itemOfTypeAtPosition) {
      items = items.splice(items.indexOf(itemOfTypeAtPosition), 1)
    } else {
      if (placementType === CellType.Teleporter) {
        const channel = extraOptions[ CellOption.TeleporterChannel ] || "1"
        items.push({ x, y, color, channel })
      } else if (placementType === CellType.Snake) {
        const id = extraOptions[ CellOption.SnakeId ] // || state.inputs.snakeNumber
        const snake = items.find((snake) => snake.id === id || snake.number === id)

        /*if (snake) {
          const indexOfPosition = _.findIndex((snake.coords as (GameAPI.Position & GameAPI.Colorable)[]), (coord, index) => {
            return coord.x === x && coord.y === coord.y
          })

          if (indexOfPosition >= 0) {
            snake.coords = (snake.coords as any[]).splice(indexOfPosition, 1)
          } else {
            let segment = { x, y }

            if (selectedColor !== snake.color) segment["color"] = selectedColor;
            (snake.coords as any[]).push(segment)
          }
        } else {
          configuration[placementType] = items.push({
            coords: [{ x, y }],
            color: selectedColor,
            id: state.inputs.snakeId,
            number: state.inputs.snakeNumber
          })
        }*/
      } else {
        items.push({ x, y, color })
      }

      configuration[ CELL_TYPE_MAP[ placementType ] ] = items
    }

    this.setState({ configuration })
  }

  renderSidebar () {
    const { application } = this.props
    const { configuration, extraOptions, placementType } = this.state

    return (
      <Sidebar
        application={ application }
        configuration={ configuration }
        extraOptions={ extraOptions }
        placementType={ placementType }
        onChangeOption={ this.onChangeOption }
        onChangeExtraOptions={ this.onChangeExtraOption }
        onChangePlacementType={ this.onChangePlacementType }
      />
    )
  }

  render () {
    const { configuration } = this.state
    const { boardColumns: width, boardRows: height } = configuration

    return (
      <Container className="BoardEditor">
        <Board
          { ...configuration }
          width={ width }
          height={ height }
          onClickCell={ this.onClickCell }
          renderer={ RenderMethod.Dom }
        />

        <div className="BoardEditor__sidebarContainer">
          { this.renderSidebar() }
          <code>{ JSON.stringify(configuration) }</code>
        </div>
      </Container>
    )
  }
}

export default createFragmentContainer<BoardEditorProps>(
  BoardEditor,
  {
    application: graphql`
      fragment BoardEditor_application on Application {
        ...BoardEditorSidebar_application
      }
    `,
    board: graphql`
      fragment BoardEditor_board on BoardConfiguration {
        configuration
      }
    `
  }
)
