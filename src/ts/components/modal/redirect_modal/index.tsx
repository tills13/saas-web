import "./index.scss"

import * as React from "react"

import { Link } from "react-router"
import { BaseModal, BaseModalProps } from "../base"

import ButtonGroup from "components/button/button_group"
import LinkButton from "components/button/link_button"
import Button from "components/form/button"
import Icon from "components/icon"

export interface RedirectModalComponentOwnProps {
  game: Models.GameInterface
  childGame: Models.GameInterface
}

type RedirectModalComponentProps =
  RedirectModalComponentOwnProps &
  BaseModalProps

export class RedirectModal extends React.Component<RedirectModalComponentProps, any> {
  renderContent = () => {
    const { close, game } = this.props

    return (
      <p>
        This game has been completed. A child game has been created with the same configuration
        and snakes.
      </p>
    )
  }

  renderFooter = () => {
    const { childGame, close } = this.props

    return (
      <ButtonGroup block>
        <LinkButton
          color={ Button.COLOR_RED }
          to="/games"
          onClick={ close }
        >
          Return to Games
        </LinkButton>
        <Button onClick={ close } disabled >
          Watch Replay <Icon icon="eye" />
        </Button>
        <LinkButton to={ `/games/${ childGame.id }` } onClick={ close } fill>
          Go to New Game
        </LinkButton>
      </ButtonGroup>
    )
  }

  renderHeader = () => {
    return (
      <div className="Modal__header">
        <h2>Game Complete</h2>
      </div>
    )
  }

  render() {
    const { game, childGame, ...rest } = this.props

    return (
      <BaseModal
        className="RedirectModal"
        renderContent={ this.renderContent }
        renderFooter={ this.renderFooter }
        renderHeader={ this.renderHeader }
        { ...rest }
      />
    )
  }
}
