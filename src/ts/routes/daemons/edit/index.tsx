import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"

import CreateEditDaemonForm from "components/daemon/form"
import Header from "components/header"

import createRelayContainer from "components/create_relay_container"

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
