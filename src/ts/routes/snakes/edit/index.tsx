import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import CreateEditSnakeForm from "components/snake/form"

import createRelayContainer from "components/create_relay_container"

interface EditSnakeInnerProps extends EditSnakeOuterProps { }
interface EditSnakeOuterProps extends React.Props<any> {
  node: GraphQL.Schema.Node<Models.Snake>
}

const EditSnake = ({ node: snake }: EditSnakeInnerProps) => {
  return (
    <div className="CreateEditSnake">
      <Header>
        <div><h2 className="Header__title">Editing { snake.name }</h2></div>
        <div>
          <LinkButton to="snakes/create" fill small>Create Snake</LinkButton>
        </div>
      </Header>
      <CreateEditSnakeForm snake={ snake } />
    </div>
  )
}

export default createRelayContainer({
  fragments: {
    node: () => Relay.QL`
      fragment on Snake {
        name
        ${ CreateEditSnakeForm.getFragment("snake") }
      }
    `
  }
})(EditSnake)
