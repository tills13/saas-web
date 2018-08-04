import React from "react"
import { graphql } from "react-relay"

import CreateEditGameForm from "components/game/CreateEditGameForm"
import Header from "components/header"

interface EditGameProps {
  application: GraphQL.Schema.Application
  game: Models.Game
}

export const EditGameQuery = graphql`
  query EditGameQuery ($gameId: ID!) {
    application { ...CreateEditGameForm_application }
    game: node (id: $gameId) {
      ...CreateEditGameForm_game
      ...on Game { id }
    }
  }
`

function EditGame ({ application, game }: EditGameProps) {
  console.log(game)

  return (
    <div className="EditGame">
      <Header className="Games__header">
        <div><h2 className="Header__title">Edit Game</h2></div>
      </Header>
      <CreateEditGameForm application={ application } game={ game } />
    </div>
  )
}

export default EditGame
