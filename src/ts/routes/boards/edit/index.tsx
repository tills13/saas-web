import "./index.scss"

import React from "react"
import Relay from "react-relay/classic"

import CreateEditDaemonForm from "components/daemon/CreateEditDaemonForm"
import Header from "components/header"

interface EditDaemonProps extends React.Props<any> {
  node: Models.Daemon
}

const EditDaemon = ({ node: daemon }: EditDaemonProps) => {
  return (
    <div className="EditDaemon">
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Edit { daemon.name }</h2></div>
      </Header>
      <CreateEditDaemonForm daemon={ daemon } />
    </div>
  )
}

export default createRelayContainer({
  fragments: {
    node: () => Relay.QL`
      fragment on Daemon {
        ${ CreateEditDaemonForm.getFragment("daemon") }
      }
    `
  }
})(EditDaemon)
