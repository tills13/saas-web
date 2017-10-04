import * as React from "react"

import { PropTypes } from "prop-types"
import { connect } from "react-redux"
import { RouteComponentProps } from "react-router"
import { compose, getContext } from "recompose"
import { Field, FormProps, formValueSelector, reduxForm, SubmissionError } from "redux-form"
import { register } from "../../../actions/session"

interface RegisterFormData {
  username: string
  password: string
}

interface LoginComponentDispatchProps {
  register: (data: Object) => Promise<void>
}

interface RegisterFormComponentStateProps {
  confirmPassword: string
  email: string
  password: string
  username: string
}

type RegisterFormComponentProps =
  RegisterFormComponentStateProps &
  FormProps &
  RouteComponentProps<any, any> &
  LoginComponentDispatchProps

export class RegisterFormComponent extends React.Component<RegisterFormComponentProps, {}> {
  handleSubmit = (data: RegisterFormData) => {
    const { register, router } = this.props

    return register(data).catch((err: string | { message: string }) => {
      const error = typeof err === "object" ? err.message : err
      throw new SubmissionError({
        _error: error || "Incorrect Username / Password"
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
    const { confirmPassword, password } = this.props

    const passwordsMatch = password === confirmPassword
    const showWarning = !pristine && !passwordsMatch && confirmPassword && confirmPassword !== ""

    return (
      <form onSubmit={ handleSubmit(this.handleSubmit) }>
        { this.renderErrors() }
        <div>
          <div className="form-group">
            <Field name="username" placeholder="username" className="form-control" type="text" component="input" autoComplete="off" />
          </div>
          <div className="form-group">
            <Field name="email" placeholder="email" className="form-control" type="text" component="input" autoComplete="off" />
          </div>
          <div className={ `form-group${ showWarning ? " has-error" : "" }` }>
            <Field name="password" placeholder="password" className="form-control" type="password" component="input" />
          </div>
          <div className={ `form-group${ showWarning ? " has-error" : "" }` }>
            <Field name="confirm-password" placeholder="confirm password" className="form-control" type="password" component="input" />
          </div>
        </div>
        <div className="text-right">
          <button className="btn btn-default" type="submit" disabled={ pristine || submitting }>
            Register
          </button>
          <button className="btn btn-default" type="submit" disabled={ pristine } onClick={ reset }>
            Reset
          </button>
        </div>
      </form>
    )
  }
}

const selector = formValueSelector("login-register-form")

function mapStateToProps(state, ownProps) {
  return {
    username: selector(state, "username") as string,
    email: selector(state, "email") as string,
    password: selector(state, "password") as string,
    confirmPassword: selector(state, "confirm-password") as string
  }
}

export default compose(
  reduxForm({ form: "login-register-form" }),
  connect<any, any, any>(mapStateToProps, { register }),
  getContext({ router: PropTypes.object })
)(RegisterFormComponent)
