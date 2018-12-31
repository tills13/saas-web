import React from "react"

import Header from "components/Header"
import CreateEditSnakeForm from "form/CreateEditSnakeForm"

function CreateSnake () {
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
