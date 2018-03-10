import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import Avatar from "components/snake/avatar"
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
      <div className="CreateEditSnake__container">
        <div className="">
          <div className="">
            <Avatar snake={ snake } /> { snake.name }
          </div>
          <div className="">
            <h3>Recent Games</h3>
            <div className="">
              { snake.games.edges.map(({ node: game, place }) => {
                return <div className="">{ game.id } { place }</div>
              }) }
            </div>
          </div>
        </div>
        <CreateEditSnakeForm snake={ snake } />
      </div>
    </div>
  )
}

export default createRelayContainer({
  fragments: {
    node: () => Relay.QL`
      fragment on Snake {
        name

        ${ Avatar.getFragment("snake") }
        ${ CreateEditSnakeForm.getFragment("snake") }
      }
    `
  }
})(EditSnake)
