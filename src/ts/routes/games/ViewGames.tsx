import React from "react"
import Relay, { createRefetchContainer, graphql } from "react-relay"

import LinkButton from "components/button/link_button"
import GameList from "components/game/GameList"
import Header from "components/header"
import Pagination from "components/pagination"

import { PaginationProps, withPagination } from "utils/hocs/with_pagination"

interface ViewGamesProps extends PaginationProps, React.AllHTMLAttributes<HTMLDivElement> {
  application: GraphQL.Schema.Application
  relay: Relay.RelayRefetchProp
}

export const ViewGamesQuery = graphql`
  query ViewGamesQuery ($after: Int, $limit: Int) {
    application { ...ViewGames_application }
  }
`

function ViewGames ({ application, pagination }: ViewGamesProps) {
  const { games } = application

  return (
    <div>
      <Header className="Games__header">
        <div><h2 className="Header__title">Games</h2></div>
        <div>
          <LinkButton to="/games/create" fill small>Create Game</LinkButton>
        </div>
      </Header>
      <GameList games={ games.items } />
      <Pagination { ...pagination } />
    </div>
  )
}

export default createRefetchContainer(
  withPagination((props: ViewGamesProps, { onChangeAfter, onChangeLimit }) => {
    const { application: { games: { pageInfo: { count } } }, relay } = props

    return {
      count,
      onChangeLimit: (newLimit) => onChangeLimit(newLimit, relay),
      onClickNextPage: (after, limit) => onChangeAfter(after + limit, relay),
      onClickPreviousPage: (after, limit) => onChangeAfter(after - limit, relay)
    }
  })(ViewGames),
  graphql`
    fragment ViewGames_application on Application
    @argumentDefinitions (
      after: { type: Int, defaultValue: 0 }
      limit: { type: Int, defaultValue: 10 }
    ) {
      games (after: $after, limit: $limit) {
        pageInfo { count }
        items { ...GameList_games }
      }
    }
  `,
  graphql`
    query ViewGamesRefetchQuery ($after: Int, $limit: Int) {
      application { ...ViewGames_application @arguments(after: $after, limit: $limit) }
    }
  `
)
