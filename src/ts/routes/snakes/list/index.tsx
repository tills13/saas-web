import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose, SetStateCallback, withState } from "recompose"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import Pagination from "components/pagination"
import SnakeAvatar from "components/snake/avatar"
import SnakeDetails from "components/snake/details"

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

class SnakeList extends React.Component<SnakeListInnerProps> {
  componentDidMount() {
    const { relay } = this.props
    relay.forceFetch({})
  }

  renderList() {
    const { pagination } = this.props

    return (
      <div className="SnakeList__list">
        <div className="List">
          { this.renderSnakes() }
        </div>
        <Pagination { ...pagination } />
      </div>
    )
  }

  renderSnakes() {
    const { application, selectedSnake, setSelectedSnake } = this.props
    const { snakes: { items: snakes } } = application

    return snakes.map((snake) => {
      const mClassName = classnames("SnakeList__item", {
        "SnakeList__item--selected": selectedSnake && snake.id === selectedSnake.id
      })

      return (
        <div
          key={ snake.id }
          className={ mClassName }
          onClick={ () => setSelectedSnake(snake) }
        >
          <SnakeAvatar snake={ snake } small />
          <div className="SnakeList__itemInfo">
            <div className="SnakeList__name">{ snake.name }</div>
            <div className="SnakeList__owner">{ snake.owner.username }</div>
          </div>
        </div>
      )
    })
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
              id
              name
              head { url }
              owner { username }

              ${ SnakeAvatar.getFragment("snake") }
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
)(SnakeList)
