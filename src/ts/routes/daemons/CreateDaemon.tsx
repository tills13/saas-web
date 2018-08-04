import React from "react"

import CreateEditDaemonForm from "components/daemon/CreateEditDaemonForm"
import Header from "components/header"

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
