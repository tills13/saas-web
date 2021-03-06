import { RouteProps, withRouter, WithRouter } from "found"
import React from "react"
import { compose } from "recompose"

import Alert from "components/Alert"
import Button from "components/Button"
import TextInput from "components/TextInput"
import Header from "components/Header"
import Toggle, { Option as ToggleOption } from "components/Toggle"
import Color from "enums/Color"

import { login, LoginData, refreshViewer, register, RegisterData } from "utils/auth"
import { FormProps, withForm } from "utils/hocs"
import Container from "components/Container";

export enum Mode { Login = "login", Register = "register" }
interface LoginRegisterProps { }
type Props = LoginRegisterProps & FormProps & WithRouter & RouteProps

const toggleOptions: ToggleOption[] = [
  { key: Mode.Login },
  { key: Mode.Register }
]

class LoginRegister extends React.Component<Props, {}> {
  onChangeMode = (newMode: Mode) => {
    this.props.router.push(`/${ newMode }`)
  }

  onSubmit = (_event: React.FormEvent<any>, data: LoginData | RegisterData) => {
    const { params: { mode }, router } = this.props
    const action = mode === Mode.Login
      ? login(data as LoginData)
      : register(data as RegisterData)

    return action.then(_ => refreshViewer().then(_ => router.push("/")))
  }

  render () {
    const { error, field, handleSubmit, params: { mode } } = this.props

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
              selectedOption={ mode }
            />
          </div>
        </Header>

        <form className="LoginRegister__form" onSubmit={ handleSubmit(this.onSubmit) }>
          { error && <Alert alertType="danger">{ error.message }</Alert> }
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

export default compose<any>(
  withForm(),
  withRouter
)(LoginRegister)
