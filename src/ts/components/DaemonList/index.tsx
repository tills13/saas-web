import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import DaemonListItem from "components/DaemonListItem"
import List from "components/List"

interface DaemonListProps {
  className?: string
  onClickDaemon?: (daemon: Models.Daemon) => void
  daemons: Models.Daemon[]
}

function DaemonList ({ className, onClickDaemon, daemons }: DaemonListProps) {
  const mClassName = classnames("DaemonList", className)

  return (
    <div className={ mClassName }>
      <List<Models.Daemon>
        items={ daemons }
        emptyMessage="No daemons..."
        onItemClick={ onClickDaemon }
        renderItem={ (daemon, onClick) => (
          <DaemonListItem
            key={ daemon.id }
            onClick={ onClick }
            daemon={ daemon }
          />
        ) }
      />
    </div>
  )
}

export default createFragmentContainer(
  DaemonList,
  graphql`
    fragment DaemonList_daemons on Daemon @relay(plural: true) {
      id

      ...DaemonListItem_daemon
    }
  `
)
