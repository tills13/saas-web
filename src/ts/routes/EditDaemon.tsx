import React from "react"
import { graphql } from "react-relay"

import Header from "components/Header"
import CreateEditDaemonForm from "form/CreateEditDaemonForm"

interface EditDaemonProps extends React.AllHTMLAttributes<HTMLDivElement> {
  daemon: Models.Daemon
}

export const EditDaemonQuery = graphql`
  query EditDaemonQuery ($daemonId: ID!) {
    daemon: node (id: $daemonId) {
      ...CreateEditDaemonForm_daemon
      ... on Daemon { name }
    }
  }
`

function EditDaemon ({ daemon }: EditDaemonProps) {
  return (
    <div className="EditDaemon">
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Edit { daemon.name }</h2></div>
      </Header>
      <CreateEditDaemonForm daemon={ daemon } />
    </div>
  )
}

export default EditDaemon
