import "./index.scss"

import React from "react"
import Relay from "react-relay/classic"
import { Link } from "react-router"
import { compose, SetStateCallback, withState } from "recompose"

import Board from "components/board"
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

interface BoardsInnerProps extends BoardsOuterProps, PaginationProps, React.Props<any> {
  currentView: ViewMode
  relay: Relay.RelayProp
  setCurrentView: SetStateCallback<ViewMode>
}

interface BoardsOuterProps {
  application: GraphQL.Schema.Application
}

class Boards extends React.Component<BoardsInnerProps> {
  renderHeader() {
    const { currentView, setCurrentView } = this.props

    return (
      <Header className="Boards__header">
        <div><h2 className="Header__title">Boards</h2></div>
        <ButtonGroup>
          <Toggle
            options={ viewOptions }
            onSelectOption={ setCurrentView }
            selectedOption={ currentView }
          />
          <LinkButton to="boards/create" fill small>Create Board</LinkButton>
        </ButtonGroup>
      </Header>
    )
  }

  renderList() {
    const { application } = this.props

    return (
      <List className="Boards__list">
        { application.boards.items.map((board) => {
          return (
            <Link
              key={ board.id }
              className="Board__listItem"
              to={ `/boards/${ board.id }/edit` }
            >
              <div>
                <h2>{ board.name }</h2> - { board.creator.username }
              </div>
              <div className="List__right">

              </div>
            </Link>
          )
        }) }
      </List>
    )
  }

  renderQuilt() {
    const { application } = this.props

    return (
      <Grid className="Boards__grid" itemsPerRow={ 4 }>
        { application.boards.items.map((board) => {
          return (
            <div key={ board.id } className="Board__gridItem">
              <Board {...board.configuration } isPreview={ true } />
              <h2>{ board.name }</h2>
              <h4>{ board.creator.username }</h4>
            </div>
          )
        }) }
      </Grid>
    )
  }

  render() {
    const { currentView, pagination } = this.props

    return (
      <div>
        { this.renderHeader() }
        <div className="BoardsContainer">
          { currentView === VIEW_MODE_QUILT ? this.renderQuilt() : this.renderList() }
          <Pagination {...pagination} />
        </div>
      </div>
    )
  }
}

export default compose<BoardsInnerProps, BoardsOuterProps>(
  createRelayContainer({
    initialVariables: {
      after: 0,
      limit: 10
    },
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          boards(after: $after, limit: $limit) {
            pageInfo { count }
            items {
              id
              name
              configuration
              visibility
              creator { username }
            }
          }
        }
      `
    }
  }),
  withState("currentView", "setCurrentView", VIEW_MODE_QUILT),
  paginate(({ application, relay, ...rest }: BoardsInnerProps) => {
    const { boards: { pageInfo: { count } } } = application
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
)(Boards)
