import React from "react"
import { Field, InjectedFormProps, reduxForm } from "redux-form"
import { setupRelay } from "utils"
import { setSessionToken } from "utils/auth"
import { http } from "utils/fetch"

import ButtonGroup from "components/button/button_group"
import LinkButton from "components/button/link_button"
import Button from "components/form/button"
import TextInput from "components/form/text_input"

interface LoginRegisterFormProps extends InjectedFormProps {
  onLoginRegisterSuccess?: () => void
}

const VIEW_LOGIN = 0
const VIEW_REGISTER = 1

class LoginRegisterForm extends React.Component<LoginRegisterFormProps> {
  state = { view: VIEW_LOGIN }

  constructor(props) {
    super(props)

    if (props.view) {
      this.state.view = props.view
    }
  }

  onSubmit = (data) => {
    const { onLoginRegisterSuccess } = this.props
    const { view } = this.state

    const url = `/session/${ view === VIEW_LOGIN ? "login" : "register" }`

    http.post(url, data).then(({ token }) => {
      setSessionToken(token)
      onLoginRegisterSuccess && onLoginRegisterSuccess()
    })

    return true
  }

  toggleView = () => {
    const { view } = this.state
    this.setState({ view: view === VIEW_LOGIN ? VIEW_REGISTER : VIEW_LOGIN })
  }

  renderLogin() {
    return (
      <div className="LoginRegisterForm__login">
        <Field
          component={ TextInput }
          label="Username or Email"
          name="username"
          placeholder="Username or Email"
        />
        <Field
          component={ TextInput }
          label="Password"
          name="password"
          placeholder="Password"
          type="password"
        />
      </div>
    )
  }

  renderRegister() {
    return (
      <div className="LoginRegisterForm__login">
        <Field
          component={ TextInput }
          label="Username"
          name="username"
          placeholder="Username"
        />
        <Field
          component={ TextInput }
          label="Email Address"
          name="email"
          placeholder="Email Address"
        />
        <Field
          component={ TextInput }
          label="Password"
          name="password"
          placeholder="Password"
          type="password"
        />
        <Field
          component={ TextInput }
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
        />
      </div>
    )
  }

  render() {
    const { handleSubmit } = this.props
    const { view } = this.state

    return (
      <form className="LoginRegisterForm" onSubmit={ handleSubmit(this.onSubmit) }>
        { view === VIEW_LOGIN ? this.renderLogin() : this.renderRegister() }
        <ButtonGroup block>
          <Button onClick={ this.toggleView } type="button">
            Go to { view === VIEW_LOGIN ? "Register" : "Login" }
          </Button>
          <Button color={ Button.COLOR_GREEN } type="submit" fill>
            { view === VIEW_LOGIN ? "Login" : "Register" }
          </Button>
        </ButtonGroup>
      </form>
    )
  }
}

export default reduxForm({
  form: "LoginForm"
})(LoginRegisterForm)
