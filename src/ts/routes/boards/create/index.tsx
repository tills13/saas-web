import { List, Map } from "immutable"
import { findIndex, map } from "lodash"
import React from "react"
import Relay from "react-relay/classic"
import { compose, withState } from "recompose"

import Board from "components/board"
import ButtonGroup from "components/button/button_group"
import Code from "components/code"
import Container from "components/container"
import Button from "components/form/button"
import ColorPicker from "components/form/color_picker"
import Select from "components/form/select"
import Icon from "components/icon"

import BoardEditor from "components/boards/editor"
import Header from "components/header"

import createContainer from "components/create_relay_container"

interface BoardConfigurationEditorComponentState {
  errors?: { [ type: string ]: { [ label: string ]: string } }
  loading: boolean
  selectedOption: "food" | "gold" | "snake" | "teleporters" | "wall" | string

  food: List<GameAPI.Food>
  gold: List<GameAPI.Gold>
  snakes: List<GameAPI.Snake>
  teleporters: List<GameAPI.Teleporter>
  walls: List<GameAPI.Wall>
}

interface BoardConfigurationEditorComponentOwnProps {
  boardConfiguration?: Models.Board
}

interface BoardConfigurationEditorComponentDispatchProps {
  getUserSnakes: (currentUser: Models.User) => Promise<void>
  createBoard: (data: Object) => Promise<void>
  updateBoard: (board: any, data: Object) => Promise<void>
}

type BoardConfigurationEditorComponentProps =
  BoardConfigurationEditorComponentOwnProps &
  BoardConfigurationEditorComponentDispatchProps

export class BoardConfigurationEditorComponent extends React.Component<any, any> {
  boardContainer: HTMLDivElement
  teleporterChannel: HTMLInputElement

  cellOptions = [
    { label: "food", value: "food" },
    { label: "gold", value: "gold" },
    { label: "snakes", value: "snakes" },
    { label: "teleporter", value: "teleporters" },
    { label: "walls", value: "walls" }
  ]

  navigation = [
    {
      label: "boards",
      to: "/boards"
    }, {
      label: "editor",
      to: "/boards/editor"
    }
  ]

  state: any = {
    loading: false,
    selectedOption: "food",
    food: List(),
    gold: List(),
    snakes: List(),
    teleporters: List(),
    walls: List(),
    inputs: {}
  }

  onInputChanged = (state, getValue, event) => {
    const value = getValue ? getValue(event.target.value) : event.target.value

    this.setState((prevState) => {
      return {
        inputs: {
          ...prevState.inputs,
          [ state ]: value
        }
      }
    }, () => {
      this.checkBoard()
    })
  }

  onClickCell = (x, y) => {
    const { selectedColor } = this.props


    this.setState((state, props) => {
      const { selectedOption } = state
      const newState = {};

      [ "food", "gold", "snakes", "teleporters", "walls" ].forEach((type) => {
        if (type !== selectedOption) {
          const items = state[ type ] as List<any>
          newState[ type ] = items.filter((item) => item.x !== x || item.y !== y)
        }
      })

      let items: List<any> = state[ selectedOption ]
      let itemOfTypeAtPosition = items.find((item) => item.x === x && item.y === y)

      if (itemOfTypeAtPosition) {
        newState[ selectedOption ] = items.remove(items.indexOf(itemOfTypeAtPosition))
      } else {
        if (selectedOption === "teleporters") {
          /** @todo */
          newState[ selectedOption ] = items.push({ x, y, color: state.inputs.color, channel: 0 })
        } else if (selectedOption === "snakes") {
          const id = state.inputs.snakeId || state.inputs.snakeNumber
          const snake = items.find((snake) => snake.id === id || snake.number === id)

          if (snake) {
            const indexOfPosition = findIndex((snake.coords as (GameAPI.Position & GameAPI.Colorable)[]), (coord, index) => {
              return coord.x === x && coord.y === coord.y
            })

            if (indexOfPosition >= 0) {
              snake.coords = (snake.coords as any[]).splice(indexOfPosition, 1)
            } else {
              let segment = { x, y }

              if (selectedColor !== snake.color) segment[ "color" ] = selectedColor;
              (snake.coords as any[]).push(segment)
            }
          } else {
            newState[ selectedOption ] = items.push({
              coords: [ { x, y } ],
              color: selectedColor,
              id: state.inputs.snakeId,
              number: state.inputs.snakeNumber
            })
          }
        } else {
          newState[ selectedOption ] = items.push({ x, y, color: selectedColor })
        }
      }

      return { ...newState }
    }, () => {
      this.checkBoard()
    })
  }

  checkBoard () {
    const { boardColumns, boardRows, name } = this.props

    const errors = {}

    /*if (teleporters.size >= 1) {
      const groups = _.groupBy(teleporters.toArray(), "channel")

      _.forEach(groups, (group, groupName) => {
        if (group.length === 1) {
          errors["Teleporters"] = {
            ...errors["Teleporters"],
            [`group ${ groupName }`]: `teleporter group ${ groupName } has no pair`
          }
        }
      })
    }*/

    if (boardRows * boardColumns < 20) {
      errors[ "Board Size" ] = { 0: "board must have at least 20 cells" }
    }

    if (!name) {
      errors[ "Name" ] = { 0: "a name is required" }
    }

    this.setState({ errors })
  }

  getBoardJSON () {
    const { boardColumns, boardRows, name } = this.props

    return {
      boardColumns,
      boardRows,
      food: this.state.food,
      gold: this.state.gold,
      snakes: this.state.snakes,
      teleporters: this.state.teleporters,
      walls: this.state.walls
    }
  }

  resetBoard = () => {
    this.setState({
      inputs: {
        boardColumns: 10,
        boardRows: 10,
        snakeId: "",
        snakeNumber: 1
      },
      food: List(),
      gold: List(),
      snakes: List(),
      teleporters: List(),
      walls: List()
    })
  }

  submitBoard = () => {
    const { boardConfiguration, createBoard, name, updateBoard } = this.props

    const data = { name, configuration: this.getBoardJSON(), visibility: "public" }

    this.setState({ loading: true }, () => {
      (!!boardConfiguration
        ? updateBoard(boardConfiguration, data)
        : createBoard(data)
      ).then(() => {
        this.setState({ loading: false })
      })
    })
  }

  renderErrors () {
    const { errors } = this.state

    if (!errors || Object.keys(errors).length === 0) {
      return (
        <div>
          <hr />
          <div><Icon icon="check" className="icon-green" /> No Issues</div>
        </div>
      )
    }

    return (
      <div>
        <hr />
        <div><Icon icon="times" className="icon-red" /> Issues</div>

        { map(errors, (typeErrors: any, type) => {
          return (
            <div key={ type }>
              <h5>{ type }</h5>
              <ul>{ map(typeErrors, (error, key) => <li key={ key }>{ error }</li>) }</ul>
            </div>
          )
        }) }
      </div>
    )
  }

  renderGeneralOptions () {
    const { selectedColor, setSelectedColor } = this.props

    return (
      <div>
        <h4>Options</h4>
        <ColorPicker
          onChange={ (color) => setSelectedColor(color) }
          value={ selectedColor }
        />
      </div>
    )
  }

  renderSnakeOptions () {
    const { selectedOption } = this.state

    if (selectedOption !== "snakes") return null

    return (
      <div>
        <h4>Snake Options</h4>
        <div className="form-group">
          <Select
            name="snake"
            onChange={ (snake) => { } }
            options={ [] }
            value={ null }
          />
          <input
            name="snake-id"
            type="text"
            className="form-control"
            placeholder="Snake Id"
            onChange={ this.onInputChanged.bind(null, "snakeId", null) }
            value={ this.state.inputs.snakeId }
          />
        </div>
        <div className="form-group">
          { /* <Select
            name="snake-id-select"
            options={ this.props.currentUserSnakes.map((snake, id) => {
              return { label: snake.name, value: id, snake }
            }).toArray() }
            onChange={ (option: any) => {
              this.setState((prevState) => {
                return {
                  inputs: {
                    ...prevState.inputs,
                    color: option.snake.defaultColor,
                    snakeId: option.value
                  }
                }
              })
            } }
            value={ this.state.inputs.snakeId }
          /> */ }
        </div>
        <div className="form-group">
          <input
            name="snake-number"
            type="number"
            className="form-control"
            placeholder="Snake Number"
            onChange={ this.onInputChanged.bind(null, "snakeNumber", null) }
            value={ this.state.inputs.snakeNumber }
          />
        </div>
      </div>
    )
  }

  renderTeleporterOptions () {
    const { selectedOption } = this.state

    if (selectedOption !== "teleporters") return null

    return (
      <div>
        <h4>Teleporter Options</h4>

        <input
          name="channel"
          ref={ e => this.teleporterChannel = e }
          className="form-control"
          placeholder="channel"
          defaultValue="1"
        />
      </div>
    )
  }

  render () {
    const { application } = this.props

    return (
      <div className="CreateOrEditBoard">
        <Header className="Boards__header">
          <div><h2 className="Header__title">Create Board</h2></div>
        </Header>
        <BoardEditor application={ application } board={ null } />
      </div>
    )
  }
}

export default compose(
  createContainer({
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          ${ BoardEditor.getFragment("application") }
        }
      `,
      viewer: () => Relay.QL`
        fragment on User {
          id
        }
      `
    }
  }),
  withState("boardColumns", "setBoardColumns", 20),
  withState("boardRows", "setBoardRows", 20),
  withState("name", "setName", null),
  withState("selectedColor", "setSelectedColor", null)
)(BoardConfigurationEditorComponent)
