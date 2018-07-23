import "./index.scss"

import React from "react"
import Relay from "react-relay/classic"
import { compose, SetStateCallback, withState } from "recompose"

import Board from "components/board"
import Container from "components/container"
import Sidebar from "./sidebar"

import createRelayContainer from "components/create_relay_container"

import {
  CELL_TYPE_FOOD,
  CELL_TYPE_GOLD,
  CELL_TYPE_SNAKE,
  CELL_TYPE_TELEPORTER,
  CELL_TYPE_WALL,
  PlacementType
} from ".."

export const OPTION_SNAKE_ID = "OPTION_SNAKE_ID"
export const OPTION_TELEPORTER_CHANNEL = "OPTION_TELEPORTER_CHANNEL"
export const OPTION_COLOR = "OPTION_COLOR"

export type ExtraOptions = {
  OPTION_COLOR: string
  OPTION_SNAKE_ID: string
  OPTION_TELEPORTER_CHANNEL: string | number
}

const CELL_TYPES = [CELL_TYPE_FOOD, CELL_TYPE_GOLD, CELL_TYPE_SNAKE, CELL_TYPE_TELEPORTER, CELL_TYPE_WALL]
const CELL_TYPE_MAP = {
  [CELL_TYPE_FOOD]: "food",
  [CELL_TYPE_GOLD]: "gold",
  [CELL_TYPE_SNAKE]: "snakes",
  [CELL_TYPE_TELEPORTER]: "teleporters",
  [CELL_TYPE_WALL]: "walls"
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

const defaultExtraOptions: Partial<ExtraOptions> = {
  OPTION_COLOR: "#000000",
  OPTION_TELEPORTER_CHANNEL: "1"
}

interface BoardEditorInnerProps extends BoardEditorOuterProps {
  extraOptions: ExtraOptions
  configuration: typeof defaultConfiguration
  placementType: PlacementType
  setConfiguration: SetStateCallback<any>
  setExtraOptions: SetStateCallback<ExtraOptions>
  setPlacementType: SetStateCallback<PlacementType>
}

interface BoardEditorOuterProps {
  application: GraphQL.Schema.Application
  board?: Models.Board
}

class BoardEditor extends React.Component<BoardEditorInnerProps> {
  containerRef: HTMLDivElement

  componentDidMount () {
    const container = this.containerRef.parentElement
    console.log(this.containerRef)
    console.log(this.containerRef.parentElement)
    // this.containerRef.style.height = "10px"

    // console.log(container)
  }

  onClickCell = (x: number, y: number) => {
    const { configuration, extraOptions, placementType, setConfiguration } = this.props

    CELL_TYPES.forEach((type) => {
      if (type !== placementType) {
        const items = configuration[CELL_TYPE_MAP[type]]
        configuration[CELL_TYPE_MAP[type]] = items.filter((item) => item.x !== x || item.y !== y)
      }
    })

    let items: any[] = configuration[CELL_TYPE_MAP[placementType]]
    let itemOfTypeAtPosition = items.find((item) => item.x === x && item.y === y)
    const color: string = extraOptions[OPTION_COLOR] || "#000000"

    if (itemOfTypeAtPosition) {
      items = items.splice(items.indexOf(itemOfTypeAtPosition), 1)
    } else {
      if (placementType === CELL_TYPE_TELEPORTER) {
        const channel = extraOptions[OPTION_TELEPORTER_CHANNEL] || "1"
        items.push({ x, y, color, channel })
      } else if (placementType === CELL_TYPE_SNAKE) {
        const id = extraOptions[OPTION_SNAKE_ID] // || state.inputs.snakeNumber
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

      configuration[CELL_TYPE_MAP[placementType]] = items
    }

    setConfiguration(configuration)
  }

  renderSidebar () {
    const {
      application,
      extraOptions,
      configuration,
      placementType,
      setExtraOptions,
      setPlacementType
    } = this.props

    const mSetExtraOptions = (mergeOptions) => {
      const mExtraOptions = Object.assign(extraOptions, mergeOptions)
      setExtraOptions(mExtraOptions)
    }

    return (
      <Sidebar
        application={ application }
        extraOptions={ extraOptions }
        placementType={ placementType }
        onChangeExtraOptions={ mSetExtraOptions }
        onChangePlacementType={ setPlacementType }
        { ...configuration }
      />
    )
  }

  render () {
    const { configuration } = this.props

    return (
      <Container className="BoardEditor" containerRef={ ref => this.containerRef = ref }>
        <div className="BoardEditor__board">
          <Board { ...configuration } onClickCell={ this.onClickCell } />
        </div>
        <div className="BoardEditor__sidebarContainer">
          { this.renderSidebar() }
        </div>
      </Container>
    )
  }
}

export default compose<BoardEditorInnerProps, BoardEditorOuterProps>(
  createRelayContainer({
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          ${ Sidebar.getFragment("application") }
        }
      `
    }
  }),
  withState("extraOptions", "setExtraOptions", defaultExtraOptions),
  withState("placementType", "setPlacementType", CELL_TYPE_WALL),
  withState("configuration", "setConfiguration", ({ board }) => board ? board.configuration : defaultConfiguration)
)(BoardEditor)
