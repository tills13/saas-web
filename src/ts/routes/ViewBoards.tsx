import { Link } from "found"
import React from "react"
import { graphql } from "react-relay"

import Board from "components/Board"
import ButtonGroup from "components/button/button_group"
import LinkButton from "components/button/link_button"
import Grid from "components/grid"
import Header from "components/header"
import List from "components/list"
import Pagination from "components/Pagination"
import ViewModeToggle, { defaultViewOptions, ViewMode } from "components/ViewModeToggle"

// import { paginate, PaginationProps } from "utils/hocs/with_pagination"

interface ViewBoardsProps {
  application: GraphQL.Schema.Application
}

interface ViewBoardsState {
  currentView: ViewMode
}

export const ViewBoardsQuery = graphql`
  query ViewBoardsQuery($after: Int, $limit: Int) {
    application {
      boards (after: $after, limit: $limit) {
        pageInfo { count }
        items {
          id
          name
          configuration
          creator { username }
        }
      }
    }
  }
`

class ViewBoards extends React.Component<ViewBoardsProps, ViewBoardsState> {
  state = { currentView: ViewMode.Quilt }

  renderHeader () {
    const { currentView } = this.state

    return (
      <Header className="Boards__header">
        <div><h2 className="Header__title">Boards</h2></div>
        <ButtonGroup>
          <ViewModeToggle
            onSelectView={ view => this.setState({ currentView: view }) }
            selectedView={ currentView }
          />
          <LinkButton to="/boards/create" fill small>Create Board</LinkButton>
        </ButtonGroup>
      </Header>
    )
  }

  renderList () {
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

  renderQuilt () {
    const { application } = this.props

    return (
      <Grid itemsPerRow={ 4 }>
        { application.boards.items.map((board) => (
          <div key={ board.id }>
            <div className="Board__container">
              <Board { ...board.configuration } isPreview={ true } />
            </div>
            <h2>{ board.name }</h2>
            <h4>{ board.creator.username }</h4>
          </div>
        )) }
      </Grid>
    )
  }

  render () {
    const { currentView } = this.state

    return (
      <div className="ViewBoards">
        { this.renderHeader() }
        { currentView === ViewMode.Quilt
          ? this.renderQuilt()
          : this.renderList() }
      </div>
    )
  }
}

export default ViewBoards
