import * as React from "react"
import * as io from "socket.io-client"

interface WrapperProps {
  game: Models.GameInterface
  params: { gameId: GraphQL.Schema.GraphQLID }
}

export const gameService = (Component: React.ComponentType<any>) => {
  return () => {
    return class extends React.Component<WrapperProps> {
      socket: SocketIOClient.Socket
      state = {
        connecting: true,
        viewers: 0
      }

      componentDidMount() {
        document.addEventListener("keypress", this.handleKeyPress)
      }

      componentDidUpdate(prevProps, prevState) {
        const { params: { gameId: prevGameId } } = prevProps
        const { params: { gameId: currGameId } } = this.props

        if (currGameId !== prevGameId) {

        }
      }

      componentWillReceiveProps(nextProps) {
        const { params: { gameId } } = this.props
        const { params: { gameId: nextGameId } } = this.props

        if (gameId !== nextGameId) this.disconnect()
      }

      componentWillUnmount() {
        document.removeEventListener("keypress", this.handleKeyPress)
        this.socket && this.socket.close()
      }

      connect() {
        const { game } = this.props

        this.socket = io.connect(`${ location.origin }`)
        this.socket.on("connect", () => {
          this.setState({ connecting: false })
          this.socket.emit("watch", game.realId)
        })

        // this.socket.on("redirect", this.handleRedirect)
        // this.socket.on("message", this.handleSocketIO)
        // this.socket.on("update", this.handleUpdate)
        this.socket.on("viewer_count", (viewers) => this.setState({ viewers }))
      }

      disconnect() {
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

      render() {
        const { game } = this.props

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
