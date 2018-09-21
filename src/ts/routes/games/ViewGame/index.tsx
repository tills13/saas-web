import "./index.scss"

import classnames from "classnames"
import { List } from "immutable"
import { chunk } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import Board, { BoardRenderer } from "components/board"
import Button from "components/form/button"
import FieldGroup from "components/form/field_group"
import SnakeAvatar from "components/snake/SnakeAvatar"
import Sidebar from "./ViewGameSidebar"

import { gameService, GameServiceInjectedProps } from "components/game/service"

interface ViewGameProps {
  game: GraphQL.Schema.Node<Models.Game>
  viewer: GraphQL.Schema.Viewer
}

export const ViewGameQuery = graphql`
  query ViewGameQuery ($gameId: ID!) {
    game: node (id: $gameId) {
      ...ViewGameSidebar_game
      ...on Game {
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
              ...SnakeAvatar_snake
            }
          }
        }
      }
    }

    viewer { id }
  }
`

class ViewGame extends React.Component<ViewGameProps & GameServiceInjectedProps> {
  simulateKeyPress = (character: string) => {
    console.log(`simulating keypress: ${ character }`)

    let event = new KeyboardEvent("keypress", { key: character })
    document.dispatchEvent(event)
  }

  renderControls () {
    const { game, viewer } = this.props

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

  render () {
    const { connecting, game, gameState } = this.props
    const mClassName = classnames("ViewGame")

    return (
      <div className={ mClassName }>
        <div className="ViewGame__boardContainer">
          { connecting && <div className="Screen" /> }
          <Board
            width={ game.boardColumns }
            height={ game.boardRows }
            { ...(gameState || { board: null }).board }
            renderer={ BoardRenderer.Canvas }
          />

          { this.renderControls() }
        </div>
        <div className="ViewGame__sidebarContainer">
          <Sidebar game={ game } { ...gameState } />
        </div>
      </div>
    )
  }
}

export default gameService()(ViewGame)
