import "./index.scss"

import classnames from "classnames"
import { List } from "immutable"
import { chunk } from "lodash"
import React from "react"
import { connect } from "react-redux"
import Relay from "react-relay/classic"
import { Link, RouteComponentProps } from "react-router"
import { compose, mapProps, SetStateCallback, withState } from "recompose"

import Board from "components/board"
import LinkButton from "components/button/link_button"
import Container from "components/container"
import Button from "components/form/button"
import FieldGroup from "components/form/field_group"
import Icon from "components/icon"
import Avatar from "components/snake/avatar"
import Sidebar from "./sidebar"

import createRelayContainer from "components/create_relay_container"
import withGameConnection, { GameServiceInjectedProps } from "components/game/service"

interface ViewGameComponentInnerProps extends ViewGameComponentOuterProps, GameServiceInjectedProps {
  debug: boolean
  setDebug: SetStateCallback<boolean>
}

interface ViewGameComponentOuterProps extends React.Props<any>, RouteComponentProps<any, any> {
  node: Models.Game
  viewer: GraphQL.Schema.Viewer
}

class ViewGame extends React.Component<ViewGameComponentInnerProps, {}> {
  // handleUpdate = (boardUpdate) => {
  //   console.log("board update", JSON.stringify(boardUpdate))

  //   const { board, daemon, errors, turn } = boardUpdate

  //   setSnakes(board.snakes)
  //   setTurnNumber(turn)

  //   this.setState({
  //     board: {
  //       food: List<GameAPI.Food>(board.food),
  //       gold: List<GameAPI.Gold>(board.gold),
  //       teleporters: List<GameAPI.Teleporter>(board.teleporters),
  //       walls: List<GameAPI.Wall>(board.walls),
  //       width: board.width,
  //       height: board.height
  //     },
  //     daemon
  //   })
  // }

  simulateKeyPress = (character: string) => {
    console.log(`simulating keypress: ${ character }`)

    let event = new KeyboardEvent("keypress", { key: character })
    document.dispatchEvent(event)
  }

  renderBoard () {
    const { connecting, node: game } = this.props

    if (connecting) return this.renderLoading()

    return null

    // return (
    //   <Board
    //     boardColumns={ board.width || game.boardColumns }
    //     boardRows={ board.height || game.boardRows }
    //     food={ board.food }
    //     gold={ board.gold }
    //     teleporters={ board.teleporters }
    //     turnNumber={ turnNumber }
    //     snakes={ snakes }
    //     walls={ board.walls }
    //   />
    // )
  }

  renderControls () {
    const { node: game, viewer } = this.props

    if (game.creator.id !== viewer.id) return null

    return (
      <FieldGroup>
        <Button onClick={ this.simulateKeyPress.bind(null, "q") }>Restart Game (q)</Button>
        <Button onClick={ this.simulateKeyPress.bind(null, "w") }>Start Game (w)</Button>
        <Button onClick={ this.simulateKeyPress.bind(null, "d") }>Step Game (d)</Button>
        <Button onClick={ this.simulateKeyPress.bind(null, "s") }>Pause Game (s)</Button>
        <Button onClick={ this.simulateKeyPress.bind(null, "e") }>Toggle Mode (e)</Button>
      </FieldGroup>
    )
  }

  renderLoading () {
    const { node: game } = this.props
    const mSnakes = game.snakes.edges.map(({ node }) => node)
    const chunks = chunk(mSnakes, 3)

    return (
      <div className="ViewGame__loading">
        <h2>Loading Game</h2>
        <div>
          { chunks.map(chunkSnakes => {
            return chunkSnakes.map((snake) => {
              return (
                <div>
                  <Avatar snake={ snake } />
                  { snake.name } -- { snake.owner.username }
                </div>
              )
            })
          }) }
        </div>
      </div>
    )
  }

  render () {
    const mClassName = classnames("ViewGame")
    const { node: game } = this.props

    const snakes = []
    const turnNumber = 0
    const viewerCount = 0

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
  withGameConnection(),
  withState("debug", "setDebug", false),
  withState("snakes", "setSnakes", []),
  withState("turnNumber", "setTurnNumber", 0),
  withState("viewerCount", "setViewerCount", 0)
)(ViewGame)
