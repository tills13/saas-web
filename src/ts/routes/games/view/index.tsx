import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import * as io from "socket.io-client"

import { PropTypes } from "prop-types"
import { showModal } from "actions"
import { List, Range } from "immutable"
import { connect } from "react-redux"
import { Link, RouteComponentProps } from "react-router"
import { compose, getContext, mapProps, SetStateCallback, withState } from "recompose"

import { RedirectModal, RedirectModalComponentOwnProps } from "components/modal/redirect_modal"
// import { ApplicationState } from "../../store"

import Board from "components/board"
import LinkButton from "components/button/link_button"
import Container from "components/container"
import Button from "components/form/button"
import Icon from "components/icon"
import Sidebar from "./sidebar"

import createRelayContainer from "components/create_relay_container"

interface ViewGameComponentInnerProps extends ViewGameComponentOuterProps {
  debug: boolean
  game: Models.GameInterface
  setDebug: SetStateCallback<boolean>
  setSnakes: SetStateCallback<GameAPI.Snake>
  setTurnNumber: SetStateCallback<number>
  setViewerCount: SetStateCallback<number>
  showModal: typeof showModal
  snakes: GameAPI.Snake[]
  turnNumber: number
  viewer: GraphQL.Schema.Viewer
  viewerCount: number
}

interface ViewGameComponentOuterProps extends React.Props<any>, RouteComponentProps<any, any> {
  params: any
}

class ViewGame extends React.Component<ViewGameComponentInnerProps, any> {
  socket: SocketIOClient.Socket
  $boardContainer: JQuery
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
    this.connect()
  }

  componentDidUpdate (prevProps, prevState) {
    const { params: { gameId: prevGameId } } = prevProps
    const { params: { gameId: currGameId } } = this.props

    if (currGameId !== prevGameId) {
      this.connect()
      /*this.setState({ loading: true }, () => {
        this.connect()
        this.props.getGame(currGameId).then(() => {
          this.setState({ loading: false })

        })
      })*/
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
    this.socket.on("connect", () => {
      this.socket.emit("watch", game.realId)
    })

    this.socket.on("redirect", this.handleRedirect)
    this.socket.on("message", this.handleSocketIO)
    this.socket.on("update", this.handleUpdate)
    this.socket.on("viewer_count", this.handleViewerCountUpdate)
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

    showModal<RedirectModalComponentOwnProps>(RedirectModal, {
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
      daemon,
      errors
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
    const { board } = this.state

    const toggleBoardOverlay = () => this.setState((prevState) => {
      return { showBoardOverlay: !prevState.showBoardOverlay }
    })

    return (
      <Board
        boardColumns={board.width || game.boardColumns}
        boardRows={board.height || game.boardRows}
        snakes={snakes}
        food={board.food}
        gold={board.gold}
        teleporters={board.teleporters}
        walls={board.walls}
        onClickCloseOverlay={toggleBoardOverlay}
        overlayContents={this.renderBoardOverlay()}
      />
    )
  }

  renderBoardOverlay () {
    const { debug, game, setDebug, viewer } = this.props
    const { gameState, showBoardOverlay } = this.state

    if (!showBoardOverlay) return null

    const toggleDebug = () => setDebug(!debug)

    return (
      <div className="overlay-contents text-center">
        <h1>{game.id}</h1>
        <div>
          <Button onClick={toggleDebug}>{debug ? "Hide" : "Show"} Debug</Button>
          {viewer.id === game.creator.id && (
            <LinkButton to={`/games/${ game.id }/edit`}>Edit Game</LinkButton>
          )}
          <LinkButton to="/games/">Edit Game</LinkButton>
        </div>
      </div>
    )
  }

  renderControls () {
    /*const { currentUser, game } = this.props

    if (currentUser && currentUser.id !== game.creator.id) return null

    const toggleBoardOverlay = () => this.setState((prevState) => {
      return { showBoardOverlay: !prevState.showBoardOverlay }
    })

    return (
      <div className="btn-row">
        <button
          className="btn btn-danger btn-block"
          onClick={ this.simulateKeyPress.bind(null, "q") }
          data-action="restart"
        >
          Restart Game (q)
                </button>

        <button
          className="btn btn-default btn-block"
          onClick={ this.simulateKeyPress.bind(null, "q") }
          data-action="start"
        >
          Start Game (w)
                </button>
        <button
          className="btn btn-default btn-block"
          onClick={ this.simulateKeyPress.bind(null, "d") }
          data-action="step"
        >
          Step Game (d)
                </button>
        <button
          className="btn btn-default btn-block"
          onClick={ this.simulateKeyPress.bind(null, "q") }
          data-action="pause"
        >
          Pause Game (s)
                </button>
        <button
          className="btn btn-default btn-block"
          onClick={ toggleBoardOverlay }
          data-action="settings"
        >
          Settings <Icon icon="gear" />
        </button>
      </div>
    )*/
  }

  renderSnakeList () {
    const { board: { snakes } } = this.state

    return (
      <div className="snakes">
        {snakes.sortBy((snake) => snake.score).map((snake, index) => {
          const style = {
            width: `${ snake.health || 100 }%`,
            background: snake.color || snake.defaultColor
          }

          return (
            <div className="snake" key={snake.id}>
              <div className="info">
                <img src={snake.head.url} />
                <div className="health-container">
                  <div className="health-bar" style={style} />
                  {snake.name} ({snake.health || 100})
                </div>
              </div>
              <div className="taunt">
                {snake.taunt || "test"}
              </div>
              {snake.goldCount !== 0 && (
                <div>{Range(0, snake.goldCount || 0).map(() => <span className="gold" />)}</div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  render () {
    const mClassName = classnames("ViewGame")
    const { game, snakes, turnNumber, viewerCount } = this.props

    return (
      <div className={mClassName}>
        <div className="ViewGame__boardContainer">
          {this.renderBoard()}
        </div>
        <div className="ViewGame__sidebarContainer">
          <Sidebar
            daemon={null}
            game={game}
            snakes={snakes}
            turnLimit={game.turnLimit}
            turnNumber={turnNumber}
            viewerCount={viewerCount}
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

          ${ Sidebar.getFragment("game") }
        }
      `
    }
  }),
  mapProps(({ node, ...rest }) => ({ game: node, ...rest })),
  connect(null, { showModal }),
  getContext({ router: PropTypes.object }),
  withState("debug", "setDebug", false),
  withState("snakes", "setSnakes", []),
  withState("turnNumber", "setTurnNumber", 0),
  withState("viewerCount", "setViewerCount", 0)
)(ViewGame)
