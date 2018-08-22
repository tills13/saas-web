import React from "react"
import io from "socket.io-client"

// import { RedirectModal } from "modals/redirect_modal"

interface WrapperProps {
  game: Models.Game
  params: { gameId: GraphQL.Schema.GraphQLID }
  showModal: typeof showModal
}

export interface GameServiceInjectedProps {
  connecting: boolean
  gameState: GameAPI.GameState
}

export interface WrapperState {
  connecting: boolean
  gameState: any
}

export const gameService = () => {
  return (Component: React.ComponentType<any>) => {
    return class GameServiceWrapper extends React.Component<WrapperProps, WrapperState> {
      socket: SocketIOClient.Socket
      state: WrapperState = {
        connecting: true,
        gameState: null
      }

      componentDidMount () {
        document.addEventListener("keypress", this.handleKeyPress)
        this.connect()
      }

      componentDidUpdate (prevProps, prevState) {
        const { params: { gameId: prevGameId } } = prevProps
        const { params: { gameId: currGameId } } = this.props

        if (currGameId !== prevGameId) {
          this.setState({ connecting: true })
          this.connect()
        }
      }

      componentWillReceiveProps (nextProps) {
        const { params: { gameId } } = this.props
        const { params: { gameId: nextGameId } } = this.props

        if (gameId !== nextGameId) this.disconnect()
      }

      componentWillUnmount () {
        document.removeEventListener("keypress", this.handleKeyPress)
        this.socket && this.socket.close()
      }

      connect () {
        const { game } = this.props

        this.socket = io.connect("localhost:3001")

        this.socket.on("redirect", this.handleRedirect)
        this.socket.on("update", this.handleUpdate)

        return new Promise((resolve, reject) => {
          this.socket.on("connect", () => {
            this.setState({ connecting: false })
            this.socket.emit("watch", game.realId)

            resolve()
          })
        })

        // this.socket.on("redirect", this.handleRedirect)
        // this.socket.on("message", this.handleSocketIO)
        // this.socket.on("update", this.handleUpdate)
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

        // showModal(RedirectModal, {
        //   childGame: redirect,
        //   game
        // })
      }

      handleUpdate = (update) => this.setState({ gameState: update })

      render () {
        return (
          <Component
            { ...this.state }
            { ...this.props }
          />
        )
      }
    }
  }
}

export default gameService
