import "./ViewSnakes.scss"

import React from "react"
import { graphql } from "react-relay"

import LinkButton from "components/button/link_button"
import Header from "components/header"
import Pagination from "components/pagination"
// import SnakeDetails from "components/snake/details"
import SnakeList from "components/snake/SnakeList"

interface ViewSnakesProps {
  application: GraphQL.Schema.Application
  // router: any
  // selectedSnake: Models.Snake
  // setSelectedSnake: SetStateCallback<Models.Snake>
}

export const ViewSnakesQuery = graphql`
  query ViewSnakesQuery ($after: Int, $limit: Int) {
    application {
      snakes (after: $after, limit: $limit) {
        pageInfo { count }
        items { ...SnakeList_snakes }
      }
    }
  }
`

function ViewSnakes ({ application: { snakes: { items: snakes } }, pagination }: ViewSnakesProps) {
  return (
    <div>
      <Header>
        <div><h2 className="Header__title">Snakes</h2></div>
        <div>
          <LinkButton to="snakes/create" fill small>Create Snake</LinkButton>
        </div>
      </Header>
      <div className="SnakeList__container">
        <div className="SnakeList__list">
          <SnakeList selectedSnake={ null } snakes={ snakes } />
          { false && <Pagination { ...pagination } /> }
        </div>
      </div>
    </div>
  )
}

export default ViewSnakes
