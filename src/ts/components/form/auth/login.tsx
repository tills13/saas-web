import * as React from "react"

import { PropTypes } from "prop-types"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
import { compose, getContext } from "recompose"
import { Field, formValueSelector, InjectedFormProps, reduxForm, SubmissionError } from "redux-form"
import { login } from "../../../actions/session"

interface LoginFormData {
  username: string
  password: string
}

interface LoginComponentDispatchProps {
  login: (data: Object) => Promise<void>
}

type LoginFormComponentProps =
  InjectedFormProps &
  RouteComponentProps<any, any> &
  LoginComponentDispatchProps

export class LoginFormComponent extends React.Component<LoginFormComponentProps, {}> {
  handleSubmit = (data: LoginFormData) => {
    const { login, router } = this.props

    return login(data).catch((err: string | { message: string }) => {
      throw new SubmissionError({
        _error: "Incorrect Username / Password"
      })
    }).then(() => {
      router.push({ pathname: "/" })
    })
  }

  renderErrors() {
    const { error } = this.props
    return error && <div className="alert alert-danger">{ error }</div>
  }

  render() {
    const { handleSubmit, submitting, pristine, reset } = this.props

    return (
      <form onSubmit={ handleSubmit(this.handleSubmit) }>
        { this.renderErrors() }

        <div className="form-group">
          <Field name="username" placeholder="username" className="form-control" type="text" component="input" autoComplete="off" />
        </div>
        <div className="form-group">
          <Field name="password" placeholder="password" className="form-control" type="password" component="input" autoComplete="off" />
        </div>
        <div className="text-right">
          <button className="btn btn-default" type="submit" disabled={ pristine || submitting }>
            Login
          </button>
          <button className="btn btn-default" type="submit" disabled={ pristine } onClick={ reset }>
            Reset
          </button>
        </div>
      </form>
    )
  }
}

export default compose(
  reduxForm({ form: "login-register-form" }),
  connect<{}, LoginComponentDispatchProps, void>(null, { login }),
  getContext({ router: PropTypes.object })
)(LoginFormComponent)
