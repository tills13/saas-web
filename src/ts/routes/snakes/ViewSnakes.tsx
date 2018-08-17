import "./ViewSnakes.scss"

import React from "react"
import Relay, { createRefetchContainer, graphql } from "react-relay"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import Pagination from "components/pagination"
// import SnakeDetails from "components/snake/details"
import SnakeList from "components/snake/SnakeList"

import { PaginationProps, withPagination } from "utils/hocs/with_pagination"

interface ViewSnakesProps extends PaginationProps {
  application: GraphQL.Schema.Application
  relay: Relay.RelayRefetchProp
}

export const ViewSnakesQuery = graphql`
  query ViewSnakesQuery ($after: Int, $limit: Int = 10) {
    application { ...ViewSnakes_application }
  }
`

function ViewSnakes ({ application: { snakes: { items: snakes } }, pagination }: ViewSnakesProps) {
  return (
    <div>
      <Header>
        <div><h2 className="Header__title">Snakes</h2></div>
        <div>
          <LinkButton to="/snakes/create" fill small>Create Snake</LinkButton>
        </div>
      </Header>
      <div className="SnakeList__container">
        <div className="SnakeList__list">
          <SnakeList selectedSnake={ null } snakes={ snakes } />
        </div>
      </div>
      <Pagination { ...pagination } />
    </div>
  )
}

export default createRefetchContainer(
  withPagination((props: ViewSnakesProps, { onChangeAfter, onChangeLimit }) => {
    const { application: { snakes: { pageInfo: { count } } }, relay } = props

    return {
      count,
      onChangeLimit: (newLimit) => onChangeLimit(newLimit, relay),
      onClickNextPage: (after, limit) => onChangeAfter(after + limit, relay),
      onClickPreviousPage: (after, limit) => onChangeAfter(after - limit, relay)
    }
  })(ViewSnakes),
  graphql`
    fragment ViewSnakes_application on Application
    @argumentDefinitions (
      after: { type: Int, defaultValue: 0 }
      limit: { type: Int, defaultValue: 10 }
    ) {
      snakes (after: $after, limit: $limit) {
        pageInfo { count }
        items { ...SnakeList_snakes }
      }
    }
  `,
  graphql`
    query ViewSnakesRefetchQuery ($after: Int, $limit: Int) {
      application { ...ViewSnakes_application @arguments(after: $after, limit: $limit) }
    }
  `
)

