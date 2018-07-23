import "./index.scss"

import React from "react"
import Relay from "react-relay/classic"
import { compose } from "recompose"

import CreateOrEditGameForm from "components/game/form"
import Header from "components/header"

import createRelayContainer from "components/create_relay_container"

interface CreateGameProps {
  application: GraphQL.Schema.Application
}

const CreateGame = ({ application }: CreateGameProps) => {
  return (
    <div className="CreateOrEditGame">
      <Header className="Games__header">
        <div><h2 className="Header__title">Create Game</h2></div>
      </Header>
      <CreateOrEditGameForm application={ application } game={ null } />
    </div>
  )
}

export default compose<CreateGameProps, CreateGameProps>(
  createRelayContainer({
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          ${ CreateOrEditGameForm.getFragment("application") }
        }
      `
    }
  })
)(CreateGame)
