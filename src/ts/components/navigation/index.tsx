import "./index.scss"

import { showModal } from "actions"
import * as classnames from "classnames"
import * as PropTypes from "prop-types"
import * as React from "react"
import { connect } from "react-redux"
import * as Relay from "react-relay/classic"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { compose, defaultProps, getContext, SetStateCallback, withState } from "recompose"

import Container from "components/container"
import FormModal from "components/modal/form_modal"
import LoginForm from "routes/landing/login/form"
import NavItem from "./nav_item"

import createContainer from "components/create_relay_container"
import { setupRelay } from "utils"
import * as utils from "utils/auth"

const transitionClassNames = {
  appear: "Navigation__mobile--appear",
  appearActive: "Navigation__mobile--appearActive",
  enter: "Navigation__mobile--enter",
  enterActive: "Navigation__mobile--enterActive",
  exit: "Navigation__mobile--exit",
  exitActive: "Navigation__mobile--exitActive"
}

interface NavigationInnerProps extends NavigationOuterProps {
  mobileMenuExpanded: boolean
  onLogin: () => void
  onLogout: () => void
  relay: Relay.RelayProp
  setMobileMenuExpanded: SetStateCallback<boolean>
  showModal: typeof showModal
}

interface NavigationOuterProps extends React.Props<any> {
  className?: string
  compact?: boolean
  onItemClick?: React.MouseEventHandler<HTMLElement>
  simple?: boolean
  viewer: GraphQL.Schema.Viewer
}

class Navigation extends React.Component<NavigationInnerProps, {}> {
  renderNavItem(className: string, to: string, content, onClick?: React.MouseEventHandler<HTMLElement>, icon?, key?) {
    const { onItemClick, setMobileMenuExpanded } = this.props

    const mOnItemClick = (event) => {
      setMobileMenuExpanded(false)
      onItemClick && onItemClick(event)
    }

    let mOnClick = onClick
      ? (event: React.MouseEvent<HTMLElement>) => onClick(event) && mOnItemClick(event)
      : mOnItemClick || onClick

    return (
      <NavItem
        key={ key || to || content }
        className={ className }
        to={ to }
        onClick={ mOnClick }
        icon={ icon }
      >
        { content }
      </NavItem>
    )
  }

  renderLeftNav() {
    return (
      <div className="Navigation__left">
        { this.renderNavItem("NavItem__brand", "/", "SaaS") }
        { this.renderNavItem(null, "/games", "Games") }
        { this.renderNavItem(null, "/snakes", "Snakes") }
        { false && this.renderNavItem(null, "/leaderboards", "Leaderboards") }
        { this.renderNavItem(null, "/documentation", "Documentation") }
      </div>
    )
  }

  renderRightNav() {
    const { mobileMenuExpanded, relay, setMobileMenuExpanded, showModal, simple, viewer } = this.props
    const { onLogin: onLoginRegisterSuccess, onLogout } = this.props

    const renderRightNavContent = () => {
      if (viewer) {
        return [
          this.renderNavItem(null, null, viewer.username, (event) => {
            showModal(FormModal, { form: LoginForm })
          }),
          this.renderNavItem(null, null, "Logout", () => utils.logout().then(onLogout))
        ]
      }

      const onClickLogin = () => showModal(FormModal, {
        form: LoginForm,
        formProps: { onLoginRegisterSuccess }
      })

      return [
        this.renderNavItem(null, "/signup", "Sign Up"),
        this.renderNavItem(null, null, "Login", onClickLogin)
      ]
    }

    return (
      <div className="Navigation__right">
        <NavItem
          className="Navigation__toggle"
          icon={ mobileMenuExpanded ? "close" : "menu" }
          onClick={ () => setMobileMenuExpanded(!mobileMenuExpanded) }
        />
        { !simple && renderRightNavContent() }
      </div>
    )
  }

  render() {
    const { className, compact, mobileMenuExpanded } = this.props
    const mClassName = classnames("Navigation", className, {
      "Navigation--compact": compact,
      "Navigation--expanded": mobileMenuExpanded
    })

    return (
      <div className={ mClassName }>
        <Container className="Navigation__inner">
          { this.renderLeftNav() }
          { this.renderRightNav() }
        </Container>
        <TransitionGroup>
          { mobileMenuExpanded && (
            <CSSTransition classNames={ transitionClassNames } timeout={ 500 }>
              <Container className="Navigation__mobile">
                { this.renderLeftNav() }
                { this.renderRightNav() }
              </Container>
            </CSSTransition>
          ) }
        </TransitionGroup>
      </div>
    )
  }
}

export default compose<NavigationInnerProps, NavigationOuterProps>(
  createContainer({
    fragments: {
      viewer: () => Relay.QL`
        fragment on User {
          id
          username
        }
      `
    }
  }),
  defaultProps({ simple: false }),
  withState("mobileMenuExpanded", "setMobileMenuExpanded", false),
  connect(null, { showModal }),
  getContext({ onLogin: PropTypes.func, onLogout: PropTypes.func })
)(Navigation)


