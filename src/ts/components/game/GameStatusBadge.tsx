import "./GameStatusBadge.scss"

import classnames from "classnames"
import { camelCase, startCase } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface GameStatusBadgeProps {
  game: Models.Game
}

function GameStatusBadge ({ game }: GameStatusBadgeProps) {
  const mStatus = game.status.toLowerCase()
  const mClassName = classnames("GameStatusBadge", `GameStatusBadge--${ camelCase(mStatus) }`)

  return (
    <div className={ mClassName }>
      { startCase(mStatus) }
    </div>
  )
}

export default createFragmentContainer(
  GameStatusBadge,
  graphql`
    fragment GameStatusBadge_game on Game {
      status
    }
  `
)
