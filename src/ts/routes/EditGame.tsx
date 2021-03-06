import React from "react"
import { graphql } from "react-relay"

import Board from "components/Board"
import Header from "components/Header"
import CreateEditGameForm from "form/CreateEditGameForm"

// import gameService from "components/game/service"

interface EditGameProps {
  application: GraphQL.Schema.Application
  game: Models.Game
}

export const EditGameQuery = graphql`
  query EditGameQuery ($gameId: ID!) {
    application { ...CreateEditGameForm_application }
    game: node (id: $gameId) {
      ...CreateEditGameForm_game
      ...on Game {
        id
        boardColumns
        boardRows
        boardConfiguration { name, configuration }
      }
    }
  }
`

function EditGame ({ application, game }: EditGameProps) {
  const configuration = game.boardConfiguration ? game.boardConfiguration.configuration : null

  return (
    <div className="EditGame">
      <Header className="Games__header">
        <div><h2 className="Header__title">Edit Game</h2></div>
      </Header>
      <div className="EditGame__container">
        <div className="EditGame__boardContainer">
          <Board
            width={ game.boardColumns }
            height={ game.boardRows }
            { ...configuration }
          />
        </div>
        <CreateEditGameForm
          application={ application }
          game={ game }
        />
      </div>
    </div>
  )
}

export default EditGame
