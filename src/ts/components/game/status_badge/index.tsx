import "./index.scss"

import * as classnames from "classnames"
import { camelCase, startCase } from "lodash"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose } from "recompose"

import createRelayContainer from "components/create_relay_container"

interface GameStatusBadgeProps {
  game: Models.GameInterface
}

const GameStatusBadge = ({ game }: GameStatusBadgeProps) => {
  const mStatus = game.status.toLowerCase()
  const mClassName = classnames("GameStatusBadge", `GameStatusBadge--${ camelCase(mStatus) }`)

  return (
    <div className={ mClassName }>
      { startCase(mStatus) }
    </div>
  )
}

export default compose<GameStatusBadgeProps, GameStatusBadgeProps>(
  createRelayContainer({
    fragments: {
      game: () => Relay.QL`
        fragment on Game {
          status
        }
      `
    }
  })
)(GameStatusBadge)
