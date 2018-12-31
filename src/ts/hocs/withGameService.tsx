import React from "react"
import io from "socket.io-client"

interface WrapperProps {
  game: Models.Game
  params: { gameId: GraphQL.GraphQLID }
}

export interface GameServiceInjectedProps {
  connecting: boolean
  gameState: GameAPI.GameState
}

export interface WrapperState {
  connecting: boolean
  gameState?: GameAPI.GameState
}

export default function withGameService () {
  return (Component: React.ComponentType<any>) => {
    return class GameServiceWrapper extends React.Component<WrapperProps, WrapperState> {
      private socket?: SocketIOClient.Socket
      state: WrapperState = { connecting: true }

      componentDidMount () {
        document.addEventListener("keypress", this.handleKeyPress)
        this.connect()
      }

      componentDidUpdate (prevProps: WrapperProps, _prevState: WrapperState) {
        const { params: { gameId } } = this.props
        const { params: { gameId: prevGameId } } = prevProps

        if (gameId !== prevGameId) {
          this.setState(
            { connecting: true },
            this.connect
          )
        }
      }

      componentWillReceiveProps (nextProps: WrapperProps) {
        const { params: { gameId } } = this.props
        const { params: { gameId: nextGameId } } = nextProps

        if (gameId !== nextGameId) {
          this.disconnect()
        }
      }

      componentWillUnmount () {
        document.removeEventListener("keypress", this.handleKeyPress)
        this.socket && this.socket.close()
      }

      connect () {
        const { game } = this.props

        this.socket = io.connect("localhost:3001")

        // this.socket.on("redirect", this.handleRedirect)
        this.socket.on("update", this.handleUpdate)

        return new Promise(resolve => {
          this.socket!.on("connect", () => {
            this.setState({ connecting: false })
            this.socket!.emit("watch", game.realId)

            resolve()
          })
        })
      }

      disconnect () {
        if (this.socket) {
          this.socket.disconnect()
        }
      }

      handleKeyPress = (event: KeyboardEvent) => {
        this.socket!.emit("keyboard_event", {
          keyCode: event.keyCode,
          key: event.key,
          repeat: event.repeat
        })
      }

      handleUpdate = (update: GameAPI.GameState) => {
        this.setState({ gameState: update })
      }

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
