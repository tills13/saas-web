import "./ViewSnakes.scss"

import { withRouter, WithRouter } from "found"
import React from "react"
import Relay, { createRefetchContainer, graphql } from "react-relay"
import { compose } from "recompose"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import Pagination from "components/pagination"
import SnakeDetails from "components/snake/SnakeDetails"
import SnakeList from "components/snake/SnakeList"

import { PaginationProps, withPagination } from "utils/hocs/with_pagination"

interface ViewSnakesProps extends PaginationProps, WithRouter {
  application: GraphQL.Schema.Application
  relay: Relay.RelayRefetchProp
  selectedSnake: Models.Snake
}

export const ViewSnakesQuery = graphql`
  query ViewSnakesQuery ($after: Int, $limit: Int = 10, $hasSnakeId: Boolean!, $snakeId: ID!) {
    application { ...ViewSnakes_application }

    selectedSnake: node (id: $snakeId) @include(if: $hasSnakeId) {
      ...SnakeDetails_snake
    }
  }
`

export function viewSnakesPrepareVariables (params) {
  return { ...params, snakeId: params.snakeId || "", hasSnakeId: !!params.snakeId }
}

function ViewSnakes ({ application, pagination, router, selectedSnake }: ViewSnakesProps) {
  const { snakes: { items: snakes } } = application

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
          <SnakeList
            onClickSnake={ snake => router.push(`/snakes/${ snake.id }`) }
            selectedSnake={ null }
            snakes={ snakes }
          />
          <Pagination { ...pagination } />
        </div>
        { selectedSnake && <SnakeDetails snake={ selectedSnake } /> }
      </div>
    </div>
  )
}

export default createRefetchContainer(
  compose<ViewSnakesProps, ViewSnakesProps>(
    withRouter,
    withPagination((props: ViewSnakesProps, { onChangeAfter, onChangeLimit }) => {
      const { application: { snakes: { pageInfo: { count } } }, relay } = props

      return {
        count,
        onChangeLimit: (newLimit) => onChangeLimit(newLimit, relay),
        onClickNextPage: (after, limit) => onChangeAfter(after + limit, relay),
        onClickPreviousPage: (after, limit) => onChangeAfter(after - limit, relay)
      }
    })
  )(ViewSnakes),
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
