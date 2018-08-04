import React from "react"
import { graphql } from "react-relay"

import CreateOrEditGameForm from "components/game/CreateEditGameForm"
import Header from "components/header"

interface CreateGameProps {
  application: GraphQL.Schema.Application
}

export const CreateGameQuery = graphql`
  query CreateGameQuery {
    application {
      ...CreateEditGameForm_application
    }
  }
`

function CreateGame ({ application }: CreateGameProps) {
  return (
    <div className="CreateOrEditGame">
      <Header className="Games__header">
        <div><h2 className="Header__title">Create Game</h2></div>
      </Header>
      <CreateOrEditGameForm application={ application } game={ null } />
    </div>
  )
}

export default CreateGame
