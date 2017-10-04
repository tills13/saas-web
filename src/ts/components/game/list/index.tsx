import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose } from "recompose"

import List from "components/list"
import Pagination from "components/pagination"
import GameListItem from "./list_item"

import { paginate, PaginationProps } from "components/pagination/paginate"

import createRelayContainer from "components/create_relay_container"

interface GameListInnerProps extends GameListOuterProps, PaginationProps {
  relay: Relay.RelayProp
}

interface GameListOuterProps {
  application: GraphQL.Schema.Application
  className?: string
}

const GameList = ({ application, className, pagination }: GameListInnerProps) => {
  const mClassName = classnames("GameList", className)
  const { games: { items: games } } = application

  return (
    <div className="GameListContainer">
      <List className={ mClassName }>
        { games.map((game) => <GameListItem key={ game.id } game={ game } />) }
      </List>
      <Pagination {...pagination} />
    </div>
  )
}

export default compose<GameListInnerProps, GameListOuterProps>(
  createRelayContainer({
    initialVariables: {
      after: 0,
      limit: 10
    },
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          games(after: $after, limit: $limit) {
            pageInfo { count }
            items {
              id
              ${ GameListItem.getFragment("game") }
            }
          }
        }
      `
    }
  }),
  paginate(({ application, relay, ...rest }: GameListInnerProps) => {
    const { games: { pageInfo: { count } } } = application
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
)(GameList)


