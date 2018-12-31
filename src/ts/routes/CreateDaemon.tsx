import React from "react"

import Header from "components/Header"
import CreateEditDaemonForm from "form/CreateEditDaemonForm"

function CreateDaemon () {
  return (
    <div className="CreateOrEditDaemon">
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Create Daemon</h2></div>
      </Header>
      <CreateEditDaemonForm daemon={ null } />
    </div>
  )
}

export default CreateDaemon
