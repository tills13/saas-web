import { Link } from "found"
import React from "react"
import { graphql } from "react-relay"

import ButtonGroup from "components/button/button_group"
import LinkButton from "components/button/link_button"
import Grid from "components/grid"
import Header from "components/header"
import Icon from "components/icon/offset_icon"
import List from "components/list"
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

class ViewDaemons extends React.Component<ViewDaemonsProps, ViewDaemonState> {
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
            onSelectView={ viewMode => this.setState({ viewMode }) }
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
      <List className="Daemons__list">
        { application.daemons!.items.map((daemon) => {
          return (
            <Link
              key={ daemon.id }
              className="Daemon__listItem"
              to={ `/daemons/${ daemon.id }/edit` }
            >
              <div>
                <h2>{ daemon.name }</h2> - { daemon.owner.username }
              </div>
              <div className="List__right">
                { daemon.averageResponseTime || "?" }s <Icon icon="av-timer" />
              </div>
            </Link>
          )
        }) }
      </List>
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

export default ViewDaemons
