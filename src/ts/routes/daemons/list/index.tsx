import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"
import { Link } from "react-router"
import { compose, SetStateCallback, withState } from "recompose"

import ButtonGroup from "components/button/button_group"
import LinkButton from "components/button/link_button"
import Container from "components/container"
import Grid from "components/grid"
import Header from "components/header"
import Icon from "components/icon/offset_icon"
import List from "components/list"
import Pagination from "components/pagination"
import Toggle from "components/toggle"

import createRelayContainer from "components/create_relay_container"
import { paginate, PaginationProps } from "components/pagination/paginate"

const VIEW_MODE_QUILT = "VIEW_MODE_QUILT"
const VIEW_MODE_LIST = "VIEW_MODE_LIST"

const viewOptions = [
  { icon: "view-quilt", key: VIEW_MODE_QUILT },
  { icon: "view-list", key: VIEW_MODE_LIST }
]

type ViewMode = typeof VIEW_MODE_QUILT | typeof VIEW_MODE_LIST

interface DaemonsInnerProps extends DaemonsOuterProps, PaginationProps, React.Props<any> {
  currentView: ViewMode
  relay: Relay.RelayProp
  setCurrentView: SetStateCallback<ViewMode>
}

interface DaemonsOuterProps {
  application: GraphQL.Schema.Application
}

class Daemons extends React.Component<DaemonsInnerProps> {
  renderQuilt() {
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

  renderHeader() {
    const { currentView, setCurrentView } = this.props

    return (
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Daemons</h2></div>
        <ButtonGroup>
          <Toggle
            options={ viewOptions }
            onSelectOption={ setCurrentView }
            selectedOption={ currentView }
          />
          <LinkButton to="daemons/create" fill small>Create Daemon</LinkButton>
        </ButtonGroup>
      </Header>
    )
  }

  renderList() {
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

  render() {
    const { currentView, pagination } = this.props

    return (
      <div>
        { this.renderHeader() }
        <div className="DaemonsContainer">
          { currentView === VIEW_MODE_QUILT ? this.renderQuilt() : this.renderList() }
          <Pagination {...pagination} />
        </div>
      </div>
    )
  }
}

export default compose<DaemonsInnerProps, DaemonsOuterProps>(
  createRelayContainer({
    initialVariables: {
      after: 0,
      limit: 10
    },
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          daemons(after: $after, limit: $limit) {
            pageInfo { count }
            items {
              id
              name
              description
              averageResponseTime
              owner { username }
            }
          }
        }
      `
    }
  }),
  withState("currentView", "setCurrentView", VIEW_MODE_QUILT),
  paginate(({ application, relay, ...rest }: DaemonsInnerProps) => {
    const { daemons: { pageInfo: { count } } } = application
    const { after, limit } = relay.variables

    return {
      after,
      itemsPerPage: limit,
      onChangeItemsPerPage: (mLimit) => relay.setVariables({ limit: mLimit }),
      totalItems: count,
      onClickNextPage: () => relay.setVariables({ after: after + limit }),
      onClickPreviousPage: () => relay.setVariables({ after: after - limit })
    }
  })
)(Daemons)
