import React from "react"
import Relay from "react-relay/classic"
import { Field, InjectedFormProps, reduxForm, SubmissionError } from "redux-form"

import Alert from "components/alert"
import ButtonGroup from "components/button/button_group"
import Button from "components/form/button"
import TextInput from "components/form/text_input"

import { CreateUserMutation } from "relay/mutations/user/create"

interface SignupFormProps extends InjectedFormProps {
  onSubmit?: (data: any) => Promise<any>
}

class SignupForm extends React.Component<SignupFormProps> {
  onSubmit = (data) => {
    const { onSubmit } = this.props

    return Promise.resolve().then(() => {
      if (onSubmit) return onSubmit(data)
      return data
    }).then(() => {
      const mutation = new CreateUserMutation(data)
      Relay.Store.commitUpdate(mutation, {
        onFailure: () => {
          throw new SubmissionError({
            _error: "Something went wrong..."
          })
        }
      })
    }).catch(err => {
      console.log(err)
      return err
    })
  }

  render() {
    const { error, handleSubmit } = this.props

    return (
      <form className="SignupForm" onSubmit={ handleSubmit(this.onSubmit) }>
        { error && <Alert type="danger">{ error }</Alert> }
        <Field
          label="Username"
          name="username"
          component={ TextInput }
        />
        <Field
          label="Email"
          name="email"
          type="email"
          component={ TextInput }
        />
        <Field
          label="Password"
          name="password"
          type="password"
          component={ TextInput }
        />
        <Field
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          component={ TextInput }
        />
        <ButtonGroup className="Signup__footer">
          <Button type="clear" color={ Button.COLOR_RED }>Clear</Button>
          <Button type="submit">Sign Up</Button>
        </ButtonGroup>
      </form>
    )
  }
}

export default reduxForm({
  form: "SignupForm"
})(SignupForm)
