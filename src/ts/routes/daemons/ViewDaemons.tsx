import "./ViewDaemons.scss"

import { Link } from "found"
import React from "react"
import { graphql } from "react-relay"

import ButtonGroup from "components/button/button_group"
import LinkButton from "components/button/link_button"
import Grid from "components/grid"
import Header from "components/header"
import Icon from "components/icon/offset_icon"
import List from "components/list"
import Toggle from "components/toggle"

enum ViewMode { List, Quilt }

interface ViewDaemonsProps {
  application: GraphQL.Schema.Application
}

interface ViewDaemonState {
  currentView: ViewMode
}

const viewOptions = [
  { icon: "view-list", key: ViewMode.List },
  { icon: "view-quilt", key: ViewMode.Quilt }
]

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
  state = { currentView: ViewMode.List }

  renderQuilt () {
    const { application } = this.props

    return (
      <Grid className="Daemons__grid" itemsPerRow={ 4 }>
        { application.daemons.items.map((daemon) => {
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
    const { currentView } = this.state

    return (
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Daemons</h2></div>
        <ButtonGroup>
          <Toggle
            options={ viewOptions }
            onSelectOption={ cv => this.setState({ currentView: cv }) }
            selectedOption={ currentView }
          />
          <LinkButton to="daemons/create" fill small>Create Daemon</LinkButton>
        </ButtonGroup>
      </Header>
    )
  }

  renderList () {
    const { application } = this.props

    return (
      <List className="Daemons__list">
        { application.daemons.items.map((daemon) => {
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
    const { currentView } = this.state

    return (
      <div>
        { this.renderHeader() }
        <div className="DaemonsContainer">
          {
            currentView === ViewMode.Quilt
              ? this.renderQuilt()
              : this.renderList()
          }
        </div>
      </div>
    )
  }
}

export default ViewDaemons
