import { withRouter, WithRouter } from "found"
import React from "react"
import { graphql } from "react-relay"

import ButtonGroup from "components/ButtonGroup"
import DaemonList from "components/DaemonList"
import LinkButton from "components/LinkButton"
import Grid from "components/Grid"
import Header from "components/Header"
import ViewModeToggle, { ViewMode } from "components/ViewModeToggle"

interface ViewDaemonsProps {
  application: GraphQL.Schema.Application
}

interface ViewDaemonState {
  viewMode: ViewMode
}

export const ViewDaemonsQuery = graphql`
  query ViewDaemonsQuery ($after: Int, $limit: Int) {
    application {
      daemons (after: $after, limit: $limit) {
        pageInfo { count }
        items {
          id
          description
          name
          owner { username }
        }
      }
    }
  }
`

class ViewDaemons extends React.Component<ViewDaemonsProps & WithRouter, ViewDaemonState> {
  state: ViewDaemonState = { viewMode: ViewMode.List }

  renderQuilt () {
    const { application } = this.props

    return (
      <Grid className="Daemons__grid">
        { application.daemons!.items.map((daemon) => {
          return (
            <div key={ daemon.id } className="Daemon__gridItem">
              <h2>{ daemon.name }</h2>
              <h4>{ daemon.owner.username }</h4>
              <p>{ daemon.description }</p>
            </div>
          )
        }) }
      </Grid>
    )
  }

  renderHeader () {
    const { viewMode } = this.state

    return (
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Daemons</h2></div>
        <ButtonGroup>
          <ViewModeToggle
            onSelectView={ vm => this.setState({ viewMode: vm }) }
            selectedView={ viewMode }
          />
          <LinkButton to="/daemons/create" fill small>Create Daemon</LinkButton>
        </ButtonGroup>
      </Header>
    )
  }

  renderList () {
    const { application } = this.props

    return (
      <DaemonList
        daemons={ application.daemons!.items }
        onClickDaemon={ daemon => router.push(`/daemons/${ daemon.id }`) }
      />
    )
  }

  render () {
    const { viewMode } = this.state

    return (
      <div>
        { this.renderHeader() }
        <div className="DaemonsContainer">
          { viewMode === ViewMode.Quilt
            ? this.renderQuilt()
            : this.renderList() }
        </div>
      </div>
    )
  }
}

export default withRouter(ViewDaemons)
