import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"

import CreateEditGameForm from "components/game/form"
import Header from "components/header"

import createRelayContainer from "components/create_relay_container"

interface EditGameInnerProps extends EditGameOuterProps { }
interface EditGameOuterProps extends React.Props<any> {
  application: GraphQL.Schema.Application
  node: GraphQL.Schema.Node<Models.GameInterface>
}

const EditGame = ({ application, node: game }: EditGameInnerProps) => {
  return (
    <div className="EditGame">
      <Header className="Games__header">
        <div><h2 className="Header__title">Edit Game</h2></div>
      </Header>
      <CreateEditGameForm application={ application } game={ game } />
    </div>
  )
}

export default createRelayContainer({
  fragments: {
    application: () => Relay.QL`
      fragment on Application {
        ${ CreateEditGameForm.getFragment("application") }
      }
    `,
    node: () => Relay.QL`
      fragment on Game {
        ${ CreateEditGameForm.getFragment("game") }
      }
    `
  }
})(EditGame)
