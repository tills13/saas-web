import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose } from "recompose"
import { Field, InjectedFormProps, reduxForm, SubmissionError } from "redux-form"

import Alert from "components/alert"
import ButtonGroup from "components/button/button_group"
import Container from "components/container"
import Button from "components/form/button"
import TextInput from "components/form/text_input"

import { CreateUserMutation } from "relay/mutations"

interface SignupInnerProps extends InjectedFormProps { }

const Signup = ({ error, handleSubmit }: SignupInnerProps) => {
  const onSubmit = (data) => {
    return new Promise((resolve, reject) => {
      const mutation = new CreateUserMutation(data)
      Relay.Store.commitUpdate(mutation, {
        onSuccess: ({ createUserMutation }) => {
          resolve()
        },
        onFailure: () => {
          reject(new SubmissionError({
            _error: "Something went wrong..."
          }))
        }
      })
    })
  }

  return (
    <Container className="Signup__container">
      <form className="Signup" onSubmit={ handleSubmit(onSubmit) }>
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
    </Container >
  )
}

export default compose<SignupInnerProps, {}>(
  reduxForm({ form: "Signup" })
)(Signup)
