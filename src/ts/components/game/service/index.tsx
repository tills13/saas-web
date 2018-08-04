import React from "react"
import { connect } from "react-redux"
import io from "socket.io-client"

import { RedirectModal } from "modals/redirect_modal"

import { showModal } from "actions"

interface WrapperProps {
  game: Models.Game
  params: { gameId: GraphQL.Schema.GraphQLID }
  showModal: typeof showModal
}

export interface GameServiceInjectedProps {
  connecting: boolean
  viewers: number
}

export interface WrapperState {
  connecting: boolean
  gameState: any
  turnLimit: number
  turnNumber: number
  viewers: number
}

export const gameService = () => {
  return (Component: React.ComponentType<any>) => {
    class GameServiceWrapper extends React.Component<WrapperProps, WrapperState> {
      socket: SocketIOClient.Socket
      state: WrapperState = {
        connecting: true,
        gameState: {},
        turnNumber: 0,
        turnLimit: 0,
        viewers: 0
      }

      componentDidMount () {
        document.addEventListener("keypress", this.handleKeyPress)
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

        this.socket = io.connect(`${ location.origin }`)

        // this.socket.on("message", this.handleMessage)
        this.socket.on("redirect", this.handleRedirect)
        this.socket.on("update", this.handleUpdate)
        this.socket.on("viewer_count", (viewers) => this.setState({ viewers }))

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

        showModal(RedirectModal, {
          childGame: redirect,
          game
        })
      }

      handleUpdate = (update) => {
        const { turn } = update

        this.setState({ gameState: update })
      }

      render () {
        const { game } = this.props

        return (
          <Component
            { ...this.state }
            { ...this.props }
          />
        )
      }
    }

    return connect(null, { showModal })(GameServiceWrapper)
  }
}

export default gameService
