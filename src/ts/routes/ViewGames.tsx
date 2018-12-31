import { withRouter, WithRouter } from "found"
import React from "react"
import Relay, { createRefetchContainer, graphql } from "react-relay"

import LinkButton from "components/LinkButton"
import GameList from "components/GameList"
import Header from "components/Header"
import Pagination from "components/Pagination"

import { PaginationProps, withPagination } from "utils/hocs/with_pagination"
import { compose } from "recompose";

interface ViewGamesProps extends PaginationProps, React.AllHTMLAttributes<HTMLDivElement> {
  application: GraphQL.Schema.Application
  relay: Relay.RelayRefetchProp
}

export const ViewGamesQuery = graphql`
  query ViewGamesQuery ($after: Int, $limit: Int) {
    application { ...ViewGames_application }
  }
`

function ViewGames ({ application, pagination, router }: ViewGamesProps & WithRouter) {
  const { games } = application

  function onItemClick (game: Models.Game) {
    router.push(`/games/${ game.id }`)
  }

  return (
    <div className="ViewGames">
      <Header className="Games__header">
        <div><h2 className="Header__title">Games</h2></div>
        <div>
          <LinkButton to="/games/create" fill small>Create Game</LinkButton>
        </div>
      </Header>
      <GameList games={ games!.items } onClickItem={ onItemClick } />
      <Pagination { ...pagination } />
    </div>
  )
}

export default createRefetchContainer(
  compose<any, any>(
    withRouter,
    withPagination((props: ViewGamesProps, { onChangeAfter, onChangeLimit }) => {
      const { application: { games }, relay } = props
      const { pageInfo: { count } } = games!

      return {
        count,
        onChangeLimit: (newLimit) => onChangeLimit(newLimit, relay),
        onClickNextPage: (after, limit) => onChangeAfter(after + limit, relay),
        onClickPreviousPage: (after, limit) => onChangeAfter(after - limit, relay)
      }
    })
  )(ViewGames),
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
