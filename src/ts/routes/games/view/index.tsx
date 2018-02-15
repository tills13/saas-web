import "./index.scss"

import * as classnames from "classnames"
import { List } from "immutable"
import { chunk } from "lodash"
import * as React from "react"
import { connect } from "react-redux"
import * as Relay from "react-relay/classic"
import { Link, RouteComponentProps } from "react-router"
import { compose, mapProps, SetStateCallback, withState } from "recompose"
import * as io from "socket.io-client"

import { RedirectModal, RedirectModalComponentOwnProps } from "components/modal/redirect_modal"

import Board from "components/board"
import LinkButton from "components/button/link_button"
import Container from "components/container"
import Button from "components/form/button"
import FieldGroup from "components/form/field_group"
import Icon from "components/icon"
import Avatar from "components/snake/avatar"
import Sidebar from "./sidebar"

import { showModal } from "actions"
import createRelayContainer from "components/create_relay_container"

interface ViewGameComponentInnerProps extends ViewGameComponentOuterProps {
  debug: boolean
  game: Models.Game
  setDebug: SetStateCallback<boolean>
  setSnakes: SetStateCallback<GameAPI.Snake>
  setTurnNumber: SetStateCallback<number>
  setViewerCount: SetStateCallback<number>
  showModal: typeof showModal
  snakes: GameAPI.Snake[]
  turnNumber: number
  viewerCount: number
}

interface ViewGameComponentOuterProps extends React.Props<any>, RouteComponentProps<any, any> {
  node: Models.Game
  params: any
  viewer: GraphQL.Schema.Viewer
}

class ViewGame extends React.Component<ViewGameComponentInnerProps, any> {
  socket: SocketIOClient.Socket

  state: any = {
    board: {
      food: List(),
      gold: List(),
      snakes: List(),
      teleporters: List(),
      walls: List()
    },
    loading: true,
    turnNumber: 0,
    turnLimit: null,
    gameState: undefined,
    viewers: 0
  }

  componentDidMount () {
    document.addEventListener("keypress", this.handleKeyPress)
    this.setState({ loading: true }, () => {
      this.connect().then(() => {
        this.setState({ loading: false })
      })
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { params: { gameId: prevGameId } } = prevProps
    const { params: { gameId: currGameId } } = this.props

    if (currGameId !== prevGameId) {
      this.setState({ loading: true }, () => {
        this.connect().then(() => {
          this.setState({ loading: false })
        })
      })
    }
  }

  componentWillUnmount () {
    document.removeEventListener("keypress", this.handleKeyPress)
    this.socket.close()
  }

  componentWillReceiveProps (nextProps) {
    const { params: { gameId } } = this.props
    const { params: { gameId: nextGameId } } = this.props

    if (gameId !== nextGameId) this.disconnect()
  }

  connect () {
    const { game } = this.props

    this.socket = io.connect(`${ location.origin }`)

    this.socket.on("redirect", this.handleRedirect)
    this.socket.on("message", this.handleSocketIO)
    this.socket.on("update", this.handleUpdate)
    this.socket.on("viewer_count", this.handleViewerCountUpdate)

    return new Promise((resolve) => {
      this.socket.on("connect", () => {
        this.socket.emit("watch", game.realId)
        resolve()
      })
    })
  }

  disconnect () {
    this.socket.disconnect()
  }

  handleKeyPress = (event: KeyboardEvent) => {
    console.log(`keypress: ${ event.keyCode }`)

    this.socket.emit("keyboard_event", {
      keyCode: event.keyCode,
      key: event.key,
      repeat: event.repeat
    })
  }

  handleRedirect = (redirect) => {
    const { game, showModal } = this.props

    showModal(RedirectModal, {
      childGame: redirect,
      game
    })
  }

  handleSocketIO = (message: { type: string, [field: string]: any }) => {
    console.log("socket:", message)
  }

  handleUpdate = (boardUpdate) => {
    const { setSnakes, setTurnNumber } = this.props
    console.log("board update", JSON.stringify(boardUpdate))

    const { board, daemon, errors, turn } = boardUpdate

    setSnakes(board.snakes)
    setTurnNumber(turn)

    this.setState({
      board: {
        food: List<GameAPI.Food>(board.food),
        gold: List<GameAPI.Gold>(board.gold),
        teleporters: List<GameAPI.Teleporter>(board.teleporters),
        walls: List<GameAPI.Wall>(board.walls),
        width: board.width,
        height: board.height
      },
      daemon
    })
  }

  handleViewerCountUpdate = (viewers) => {
    const { setViewerCount } = this.props
    console.log("viewer count update", viewers)
    setViewerCount(viewers)
  }

  simulateKeyPress = (character: string) => {
    console.log(`simulating keypress: ${ character }`)

    let event = new KeyboardEvent("keypress", { key: character })
    document.dispatchEvent(event)
  }

  renderBoard () {
    const { game, snakes } = this.props
    const { board, turnNumber } = this.state


    if (this.state.loading) {
      const mSnakes = game.snakes.edges.map(({ node }) => node)
      const chunks = chunk(mSnakes, 3)

      return (
        <div className="ViewGame__loading">
          <h2>Loading Game</h2>
          <div className="">
            { chunks.map(chunkSnakes => {
              return chunkSnakes.map((snake) => {
                return (
                  <div>
                    <Avatar snake={ snake } /> { snake.name } -- { snake.owner.username }
                  </div>
                )
              })
            }) }
          </div>
        </div>
      )
    }

    return (
      <Board
        boardColumns={ board.width || game.boardColumns }
        boardRows={ board.height || game.boardRows }
        food={ board.food }
        gold={ board.gold }
        teleporters={ board.teleporters }
        turnNumber={ turnNumber }
        snakes={ snakes }
        walls={ board.walls }
      />
    )
  }

  renderControls () {
    const { game, viewer } = this.props

    if (game.creator.id !== viewer.id) return null

    return (
      <FieldGroup>
        <Button onClick={ this.simulateKeyPress.bind(null, "q") }>Restart Game (q)</Button>
        <Button onClick={ this.simulateKeyPress.bind(null, "w") }>Start Game (w)</Button>
        <Button onClick={ this.simulateKeyPress.bind(null, "d") }>Step Game (d)</Button>
        <Button onClick={ this.simulateKeyPress.bind(null, "s") }>Pause Game (s)</Button>
      </FieldGroup>
    )
  }

  render () {
    const mClassName = classnames("ViewGame")
    const { game, snakes, turnNumber, viewerCount } = this.props
    const { errors } = this.state

    return (
      <div className={ mClassName }>
        <div className="ViewGame__boardContainer">
          { this.renderBoard() }
          { this.renderControls() }
        </div>
        <div className="ViewGame__sidebarContainer">
          <Sidebar
            daemon={ null }
            game={ game }
            snakes={ snakes }
            turnLimit={ game.turnLimit }
            turnNumber={ turnNumber }
            viewerCount={ viewerCount }
          />
        </div>
      </div>
    )
  }
}

export default compose(
  createRelayContainer({
    fragments: {
      node: () => Relay.QL`
        fragment on Game {
          id
          realId
          boardColumns
          boardRows

          creator { id }

          snakes(first: 12) {
            edges {
              node {
                name
                owner { username }
                ${ Avatar.getFragment("snake") }
              }
            }
          }

          ${ Sidebar.getFragment("game") }
        }
      `,
      viewer: () => Relay.QL`
        fragment on User {
          id
        }
      `
    }
  }),
  mapProps(({ node, ...rest }) => ({ game: node, ...rest })),
  connect(null, { showModal }),
  withState("debug", "setDebug", false),
  withState("snakes", "setSnakes", []),
  withState("turnNumber", "setTurnNumber", 0),
  withState("viewerCount", "setViewerCount", 0)
)(ViewGame)
