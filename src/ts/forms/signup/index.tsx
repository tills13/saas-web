import React from "react"
import Relay from "react-relay"

import Alert, { AlertType } from "components/alert"
import ButtonGroup from "components/button/button_group"
import Button from "components/form/button"
import TextInput from "components/form/text_input"

import { CreateUserMutation } from "relay/mutations/user/create"

interface SignupFormProps {
  onSubmit?: (data: any) => Promise<any>
}

class SignupForm extends React.Component<any> {
  onSubmit = (data) => {
    const { onSubmit } = this.props

    return Promise.resolve().then(() => {
      if (onSubmit) return onSubmit(data)
      return data
    }).then(() => {
      // const mutation = new CreateUserMutation(data)
      // Relay.Store.commitUpdate(mutation, {
      //   onFailure: () => {

      //   }
      // })
    }).catch(err => {
      console.log(err)
      return err
    })
  }

  render () {
    const { error, handleSubmit } = this.props

    return (
      <form className="SignupForm" onSubmit={ this.onSubmit }>
        { error && <Alert alertType={ AlertType.Danger }>{ error }</Alert> }

        <TextInput label="Username" name="username" />
        <TextInput label="Email" name="email" type="email" />
        <TextInput label="Password" name="password" type="password" />
        <TextInput label="Confirm Password" name="confirmPassword" type="password" />

        <ButtonGroup className="Signup__footer">
          <Button type="clear" color={ Button.COLOR_RED }>Clear</Button>
          <Button type="submit">Sign Up</Button>
        </ButtonGroup>
      </form>
    )
  }
}

export default SignupForm
