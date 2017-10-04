import "./index.scss"

import * as React from "react"

import CreateEditDaemonForm from "components/daemon/form"
import Header from "components/header"

import createRelayContainer from "components/create_relay_container"

const CreateDaemon = () => {
  return (
    <div className="CreateOrEditDaemon">
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Create Daemon</h2></div>
      </Header>
      <CreateEditDaemonForm daemon={ null } />
    </div>
  )
}

export default createRelayContainer({
  fragments: {}
})(CreateDaemon)
