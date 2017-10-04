import "./index.scss"

import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose } from "recompose"
import { reduxForm } from "redux-form"

import createRelayContainer from "components/create_relay_container"

const Login = ({ }) => {
  return (
    <div />
  )
}

export default compose(
  createRelayContainer({
    fragments: {}
  })
)(Login)
