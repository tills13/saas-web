import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"

import Header from "components/header"
import CreateEditSnakeForm from "components/snake/form"

import createContainer from "components/create_relay_container"

interface CreateSnakeProps extends React.Props<any> {
  application: GraphQL.Schema.Application
}

const CreateSnake = ({ application }) => {
  return (
    <div className="CreateEditSnake">
      <Header>
        <div><h2 className="Header__title">Create Snake</h2></div>
      </Header>
      <CreateEditSnakeForm snake={ null } />
    </div>
  )
}

export default CreateSnake
