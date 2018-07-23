import "./index.scss"

import classnames from "classnames"
import React from "react"
import Relay from "react-relay/classic"

import { compose } from "recompose"

import LinkButton from "components/button/link_button"
import Button from "components/form/button"
import GameList from "components/game/list"
import Header from "components/header"

import createContainer from "components/create_relay_container"

interface GameListProps extends React.Props<any> {
  application: GraphQL.Schema.Application
}

export const GamesList = ({ application }: GameListProps) => {
  const { games } = application

  return (
    <div>
      <Header className="Games__header">
        <div><h2 className="Header__title">Games</h2></div>
        <div>
          <LinkButton to="games/create" fill small>Create Game</LinkButton>
        </div>
      </Header>
      <GameList application={ application } />
    </div >
  )
}

export default compose<GameListProps, GameListProps>(
  createContainer({
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          id
          ${ GameList.getFragment("application") }
        }
      `
    }
  })
)(GamesList)
