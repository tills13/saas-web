import "./index.scss"

import { withRouter, WithRouter } from "found"
import React from "react"
import { compose } from "recompose"

import Alert, { AlertType } from "components/alert"
import Container from "components/container/route_container"
import Button from "components/form/button"
import TextInput from "components/form/text_input"
import Header from "components/header"
import Toggle, { Option as ToggleOption } from "components/toggle"
import Color from "enums/Color"

import { login, refreshViewer, register } from "utils/auth"
import { FormProps, withForm } from "utils/hocs"

export enum Mode { Login = "login", Register = "register" }

interface LoginRegisterProps extends FormProps, WithRouter { }

interface LoginRegisterState {
  mode: Mode
}

const toggleOptions: ToggleOption[] = [
  { key: Mode.Login },
  { key: Mode.Register }
]

class LoginRegister extends React.Component<LoginRegisterProps, LoginRegisterState> {
  static defaultProps = { mode: Mode.Register }

  constructor (props) {
    super(props)

    this.state = { mode: props.mode }
  }

  onChangeMode = (newMode: Mode) => {
    this.setState({ mode: newMode })
  }

  onSubmit = (_: React.FormEvent<any>, data) => {
    const { router } = this.props
    const { mode } = this.state

    const action = mode === Mode.Login ? login(data) : register(data)

    return action.then(_ => refreshViewer().then(_ => router.push("/")))
  }

  render () {
    const { error, field, handleSubmit } = this.props
    const { mode } = this.state

    return (
      <Container className="LoginRegister">
        <Header>
          <div>
            <h2 className="Header__title">
              { mode === Mode.Register ? "Register" : "Login" }
            </h2>
          </div>
          <div>
            <Toggle
              onSelectOption={ this.onChangeMode }
              options={ toggleOptions }
              selectedOption={ this.state.mode }
            />
          </div>
        </Header>

        <form className="LoginRegister__form" onSubmit={ handleSubmit(this.onSubmit) }>
          { error && <Alert alertType={ AlertType.Danger }>{ error.message }</Alert> }
          <TextInput label="Username" { ...field("username") } />
          { mode === Mode.Register && <TextInput label="Email" type="email" { ...field("email") } /> }
          <TextInput label="Password" type="password" { ...field("password") } />
          { mode === Mode.Register && <TextInput label="Confirm Password" type="password" { ...field("confirmPassword") } /> }
          <Button type="submit" color={ Color.Green }>{ mode === Mode.Register ? "Register" : "Login" }</Button>
        </form>
      </Container>
    )
  }
}

export default compose(
  withForm(),
  withRouter
)(LoginRegister)
