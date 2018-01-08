import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose, SetStateCallback, withState } from "recompose"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import Pagination from "components/pagination"
import SnakeDetails from "components/snake/details"
import SnakeList from "components/snake/list"

import createRelayContainer from "components/create_relay_container"
import { paginate, PaginationProps } from "components/pagination/paginate"

interface SnakeListInnerProps extends PaginationProps, SnakeListOuterProps {
  relay: Relay.RelayProp
  selectedSnake: Models.SnakeInterface
  setSelectedSnake: SetStateCallback<Models.SnakeInterface>
}

interface SnakeListOuterProps {
  application: GraphQL.Schema.Application
}

class SnakesList extends React.Component<SnakeListInnerProps> {
  componentDidMount() {
    const { relay } = this.props
    relay.forceFetch({})
  }

  renderList() {
    const { application, pagination, selectedSnake, setSelectedSnake } = this.props
    const { snakes: { items: snakes } } = application

    return (
      <div className="SnakeList__list">
        <SnakeList
          onClickSnake={ setSelectedSnake }
          selectedSnake={ selectedSnake }
          snakes={ snakes }
        />
        <Pagination { ...pagination } />
      </div>
    )
  }

  render() {
    const { application, pagination, selectedSnake, setSelectedSnake } = this.props
    const { snakes: { items: snakes } } = application

    return (
      <div>
        <Header>
          <div><h2 className="Header__title">Snakes</h2></div>
          <div>
            <LinkButton to="snakes/create" fill small>Create Snake</LinkButton>
          </div>
        </Header>
        <div className="SnakeList__container">
          { this.renderList() }
          { selectedSnake && <SnakeDetails snake={ selectedSnake } /> }
        </div>
      </div>
    )
  }
}

export default compose(
  createRelayContainer({
    initialVariables: {
      after: 0,
      limit: 10
    },
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          snakes(after: $after, limit: $limit) {
            pageInfo { count }
            items {
              ${ SnakeList.getFragment("snakes") }
              ${ SnakeDetails.getFragment("snake") }
            }
          }
        }
      `
    }
  }),
  withState("selectedSnake", "setSelectedSnake", null),
  paginate(({ application, relay, ...rest }: SnakeListInnerProps) => {
    const { snakes: { pageInfo: { count } } } = application
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
)(SnakesList)
