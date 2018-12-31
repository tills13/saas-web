import React from "react"
import { graphql } from "react-relay"

import Board from "components/Board"
import Button from "components/Button"
import FieldGroup from "components/FieldGroup"
import Sidebar from "./games/ViewGame/ViewGameSidebar"

import withGameService, { GameServiceInjectedProps } from "hocs/withGameService"
import BoardRenderer from "components/Board/renderer"

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
  private renderer = new BoardRenderer()

  simulateKeyPress = (character: string) => {
    console.log(`simulating keypress: ${ character }`)

    let event = new KeyboardEvent("keypress", { key: character })
    document.dispatchEvent(event)
  }

  renderControls () {
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

    return (
      <div className="ViewGame">
        <div className="ViewGame__boardContainer">
          { connecting && <div className="Screen" /> }

          { gameState && (
            <Board
              height={ game.boardRows }
              renderer={ this.renderer }
              width={ game.boardColumns }
              { ...gameState.board }
            />
          ) }

          { this.renderControls() }
        </div>
        <div className="ViewGame__sidebarContainer">
          <Sidebar game={ game } { ...gameState } />
        </div>
      </div>
    )
  }
}

export default withGameService()(ViewGame)
