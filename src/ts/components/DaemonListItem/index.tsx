import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components"

import ButtonGroup from "components/ButtonGroup"
import Icon from "components/Icon"
import IconButton from "components/IconButton"

interface DaemonListItemProps extends React.AllHTMLAttributes<HTMLDivElement> {
  daemon: Models.Daemon
}

const StyledDaemonListItem = styled.div`
  display: flex;
  justify-content: space-between;

  cursor: pointer;
`

function DaemonListItem ({ daemon, onClick }: DaemonListItemProps) {
  return (
    <StyledDaemonListItem onClick={ onClick }>
      <div className="DaemonListItem__info">
        <div className="DaemonListItem__name">{ daemon.name }</div>
        <div className="DaemonListItem__owner">{ daemon.owner.username }</div>
      </div>
      <div className="DaemonListItem__extra">
        <ButtonGroup className="DaemonListItem__actions">
          <IconButton icon="edit" />
          <IconButton icon="delete" />
          <IconButton icon="arrow_right" />
        </ButtonGroup>
        <Icon icon={ daemon.visibility === "PUBLIC" ? "lock_open" : "lock" } />
      </div>
    </StyledDaemonListItem>
  )
}

export default createFragmentContainer(
  DaemonListItem,
  graphql`
    fragment DaemonListItem_daemon on Daemon {
      name, visibility, owner { username }
    }
  `
)
