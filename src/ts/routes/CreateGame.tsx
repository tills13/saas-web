import React from "react"
import { graphql } from "react-relay"

import Header from "components/Header"
import CreateEditGameForm from "form/CreateEditGameForm"

interface CreateGameProps {
  application: GraphQL.Schema.Application
}

export const CreateGameQuery = graphql`
  query CreateGameQuery {
    application { ...CreateEditGameForm_application }
  }
`

function CreateGame ({ application }: CreateGameProps) {
  return (
    <div className="CreateGame">
      <Header className="Games__header">
        <div><h2 className="Header__title">Create Game</h2></div>
      </Header>
      <CreateEditGameForm application={ application } game={ null } />
    </div>
  )
}

export default CreateGame
